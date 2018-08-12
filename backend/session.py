import asyncio
import websockets
import json
import datetime
import os
from game import TicTacToe
from random import randint

import logging
logging.basicConfig(filename='log.txt', filemode='w', format='%(levelname)s (%(asctime)s): %(message)s', level=logging.INFO)

class Session:
    def __init__(self):
        logging.info('Initializing data for new game')
        # time limit (in seconds) for each player; set to 0 to disable
        self.turn_time_limit = 5

        # sets a limit on the number of boards that can be played simultaneously; set to 0 to disable
        self.max_boards = 16

        self.connected = set()
        self.player1 = None
        self.player2 = None

        self.boards = {} # (game, moves)
        self.latest_id = -1
        self.score = {'X': 0, 'O': 0}

    def turn_limits_enabled(self):
        return self.turn_time_limit > 0

    def max_boards_enabled(self):
        return self.max_boards > 0

    def get_num_active_boards(self):
        return len({board_id:match for board_id, match in self.boards.items() if not match['game'].winner})

    def get_player_token(self, websocket):
        if websocket is self.player1:
            return 'X'
        elif websocket is self.player2:
            return 'O'
        else:
            return None

    def get_websocket_from_token(self, token):
        if token is 'X':
            return self.player1
        elif token is 'O':
            return self.player2
        else:
            logging.error(f'Unknown token {token}')

    def random_piece(self):
        return 'X' if randint(0, 1) == 0 else 'O'

    async def update_score(self, x_points, o_points):
        self.score['X'] = x_points
        self.score['O'] = o_points

        data = {
            'score-changed': {
                'X': self.score['X'],
                'O': self.score['O']
            }
        }

        logging.info(f'New score: X = {self.score["X"]}, O = {self.score["O"]}')
        await asyncio.wait([ws.send(json.dumps(data)) for ws in self.connected])

    async def end_match(self, board_id, game):
        winner = game.winner if game.winner else 'tie'
        data = {
            'board-ended': {
                'board-id': board_id,
                'winner': winner
            }
        }

        logging.info(f'Winner for board {board_id}: {winner}')
        await asyncio.wait([ws.send(json.dumps(data)) for ws in self.connected])

        if game.winner and self.get_websocket_from_token(game.winner) is self.player1:
            await self.update_score(self.score['X'] + 1, self.score['O'])
        else:
            await self.update_score(self.score['X'], self.score['O'] + 1)

    async def handle_cell_clicked(self, websocket, message):
        id = message['board-id']
        cell = message['cell']
        row = int(cell['r'])
        col = int(cell['c'])

        logging.debug(f'Handling cell click {row}, {col} on board {id}')

        player = self.get_player_token(websocket)
        if not player:
            logging.error(f'Player for websocket {websocket} not found')
            return

        board = self.boards.get(id)
        if not board:
            logging.error(f'Board with id {id} not found')
            return

        game = board['game']

        done = game.next_turn(player, row, col)
        data = {
            'piece-placed':  {
                'board-id': id,
                'cell': cell,
                'piece': player
            }
        }
        await asyncio.wait([ws.send(json.dumps(data)) for ws in self.connected])

        if done:
            await self.end_match(id, game)
        else:
            await self.start_turn(id, game.turn)

        if self.max_boards_enabled():
            num_active = self.get_num_active_boards()
            logging.debug(f'# of active boards: {num_active}, # of max boards: {self.max_boards}')
            if num_active < self.max_boards:
                await self.start_new_match()
            else:
                logging.info(f'Max number of boards ({self.max_boards}) reached')
        else:
            await self.start_new_match()

    # Oh lord
    async def check_for_expired_turns(self):
        while True:
            await asyncio.sleep(0.1)
            for board_id in self.boards:
                match = self.boards[board_id]
                game = match['game']

                if not game.over and 'turn_expires' in match and datetime.datetime.now() >= match['turn_expires']:
                    logging.debug(f'Skipping turn for player {game.turn} on match {board_id}')
                    next_turn_piece = 'O' if game.turn == 'X' else 'X'
                    game.turn = next_turn_piece
                    asyncio.ensure_future(self.start_turn(board_id, next_turn_piece))

    async def start_turn(self, board_id, game_piece):
        logging.debug(f'Starting turn for {game_piece} on board {board_id}')

        if self.turn_limits_enabled():
            turn_expires = datetime.datetime.now() + datetime.timedelta(seconds=self.turn_time_limit)
            self.boards[board_id]['turn_expires'] = turn_expires

        data = {
            'board-turn-changed': {
                'board-id': board_id,
                'turn': game_piece,
                'time-limit-ms': self.turn_time_limit * 1000
            }
        }

        await asyncio.wait([ws.send(json.dumps(data)) for ws in self.connected])

    async def start_new_match(self):
        logging.info('Starting new match')

        game = TicTacToe(turn=self.random_piece())
        self.latest_id = self.latest_id + 1
        self.boards[self.latest_id] = {'game': game}

        data = {
            'board-started': {
                'board-id': self.latest_id
            }
        }
        await asyncio.wait([ws.send(json.dumps(data)) for ws in self.connected])
        await self.start_turn(self.latest_id, game.turn)

    async def add_player(self, websocket, player):
        data = {
            'game-started': {
                'player-piece': player
            }
        }
        await websocket.send(json.dumps(data))

    async def end_game(self):
        if self.score['X'] > self.score['O']:
            winner = 'X'
        elif self.score['O'] > self.score['X']:
            winner = 'O'
        else:
            winner = 'tie'

        data = {
            'game-ended': {
                'winner':  winner
            }
        }

        logging.info(f'Overall winner: {winner}')
        await asyncio.wait([ws.send(json.dumps(data)) for ws in self.connected])

    async def handle_message(self, websocket, message):
        if message['cell-clicked']:
            try:
                await self.handle_cell_clicked(websocket, message['cell-clicked'])
            except Exception as e:
                logging.exception(e)

    async def connection_handler(self, websocket, path):
        self.connected.add(websocket)

        try:
            await asyncio.wait([ws.send('Hello!') for ws in self.connected])

            if not self.player1:
                logging.info(f'Player1 (X) has joined ({websocket})')
                self.player1 = websocket
                await self.add_player(websocket, 'X')
                
            elif not self.player2:
                logging.info(f'Player2 (O) has joined ({websocket})')
                self.player2 = websocket
                await self.add_player(websocket, 'O')
            else:
                # observer
                pass

            if self.player1 and self.player2:
                await self.start_new_match()

            logging.debug('Waiting for messages')
            async for message in websocket:
                logging.debug('Message received')
                data = json.loads(message)
                await self.handle_message(websocket, data)
        finally:
            logging.info(f'Websocket {websocket} disconnecting')
            self.connected.remove(websocket)
            if websocket is self.player1:
                logging.info('Player1 has left. Ending game now...')
                self.player1 = None
                await self.end_game()
            elif websocket is self.player2:
                logging.info('Player2 has left. Ending game now...')
                self.player2 = None
                await self.end_game()


session = Session()
start_server = websockets.serve(session.connection_handler, '0.0.0.0', 8765)
asyncio.get_event_loop().run_until_complete(start_server)

if session.turn_limits_enabled():
    asyncio.ensure_future(session.check_for_expired_turns())

asyncio.get_event_loop().run_forever()
