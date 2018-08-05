import asyncio
import websockets
import json
import random
import datetime
import os
import queue
from game import TicTacToe

import logging
logging.basicConfig(filename='log.txt', level=logging.INFO)
logging.info(f"Process ID: {os.getpid()}")

connected = set()
player1 = None
player2 = None

boards = {} # (game, moves)
pending_turns = queue.Queue()
latest_id = -1
score = {'X': 0, 'O': 0}

async def time(websocket, path):
    while True:
        now = datetime.datetime.utcnow().isoformat() + 'Z'
        await websocket.send(now)
        await asyncio.sleep(random.random() * 3)

def get_player_token(websocket):
    if websocket is player1:
        return 'X'
    elif websocket is player2:
        return 'O'
    else:
        return None

def get_websocket_from_token(token):
    if token is 'X':
        return player1
    elif token is 'O':
        return player2
    else:
        logging.error(f'Unknown token {token}')

async def update_score(x_points, o_points):
    score['X'] = x_points
    score['O'] = o_points

    data = {
        'score-changed': {
            'X': score['X'],
            'O': score['O']
        }
    }

    logging.info(f'New score: X = {score["X"]}, O = {score["O"]}')
    await asyncio.wait([ws.send(json.dumps(data)) for ws in connected])

async def end_match(board_id, game):
    global player1, player2
    winner = game.winner if game.winner else 'tie'
    data = {
        'board-ended': {
            'board-id': board_id,
            'winner': winner
        }
    }

    logging.info(f'Winner for board {board_id}: {winner}')
    await asyncio.wait([ws.send(json.dumps(data)) for ws in connected])

    if game.winner and get_websocket_from_token(game.winner) is player1:
        await update_score(score['X'] + 1, score['O'])
    else:
        await update_score(score['X'], score['O'] + 1)

async def handle_cell_clicked(websocket, message):
    id = message['board-id']
    cell = message['cell']
    row = int(cell['r'])
    col = int(cell['c'])

    logging.debug(f'Handling cell click {row}, {col} on board {id}')

    player = get_player_token(websocket)
    if not player:
        logging.error(f'Player for websocket {websocket} not found')
        return

    game = boards.get(id)['game']
    if not game:
        logging.error(f'Game with id {id} not found')
        return

    done = game.next_turn(player, row, col)
    data = {
        'piece-placed':  {
            'board-id': id,
            'cell': cell,
            'piece': player
        }
    }
    await asyncio.wait([ws.send(json.dumps(data)) for ws in connected])

    if done:
        await end_match(id, game)
    else:
        await start_turn(id, game.turn)

    await start_new_match()

# Oh lord
async def check_for_expired_turns():
    global pending_turns

    while True:
        await asyncio.sleep(0.1)
        if not pending_turns.empty():
            pending = pending_turns.get()
            board_id = pending['board_id']
            game = boards[board_id]['game']
            current_turn_number = boards[board_id]['moves']
            game_piece = pending['game_piece']
            turn = pending['turn_number']
            #logging.debug(f'Checking player {game_piece}\'s turn {turn} for match {board_id}')

            if current_turn_number == turn and datetime.datetime.now() > pending['expires'] and not game.over:
                logging.debug(f'Skipping turn for player {game_piece} on match {board_id}')
                next_turn_piece = 'O' if game_piece == 'X' else 'X'
                game.turn = next_turn_piece
                asyncio.ensure_future(start_turn(board_id, next_turn_piece))
            else:
                pending_turns.put(pending)

async def start_turn(board_id, game_piece):
    logging.debug(f'Starting turn for {game_piece} on board {board_id}')

    boards[board_id]['moves'] = boards[board_id]['moves'] + 1
    data = {
        'board-turn-changed': {
            'board-id': board_id,
            'turn': game_piece,
            'time-limit-ms': '5000'
        }
    }

    pending_turns.put(
        {
            'board_id': board_id,
            'turn_number': boards[board_id]['moves'],
            'game_piece': game_piece,
            'expires': datetime.datetime.now() + datetime.timedelta(seconds=5)
        }
    )
    await asyncio.wait([ws.send(json.dumps(data)) for ws in connected])

async def start_new_match():
    logging.info('Starting new match')

    global latest_id

    game = TicTacToe()
    latest_id = latest_id + 1
    boards[latest_id] = {'game': game, 'moves': 0}

    data = {
        'board-started': {
            'board-id': latest_id
        }
    }
    await asyncio.wait([ws.send(json.dumps(data)) for ws in connected])
    await start_turn(latest_id, game.turn)

async def add_player(websocket, player):
    data = {
        'game-started': {
            'player-piece': player
        }
    }
    await websocket.send(json.dumps(data))

async def end_game():
    global score, player1, player2

    if score['X'] > score['O']:
        winner = 'X'
    elif score['O'] > score['X']:
        winner = 'O'
    else:
        winner = 'tie'

    data = {
        'game-ended': {
            'winner':  winner
        }
    }

    logging.info(f'Overall winner: {winner}')
    await asyncio.wait([ws.send(json.dumps(data)) for ws in connected])

async def handle_message(websocket, message):
    if message['cell-clicked']:
        try:
            await handle_cell_clicked(websocket, message['cell-clicked'])
        except Exception as e:
            logging.error(e)

async def connection_handler(websocket, path):
    connected.add(websocket)

    try:
        await asyncio.wait([ws.send('Hello!') for ws in connected])
        global player1, player2

        if not player1:
            logging.info(f'Player1 (X) has joined ({websocket})')
            player1 = websocket
            await add_player(websocket, 'X')
            
        elif not player2:
            logging.info(f'Player2 (O) has joined ({websocket})')
            player2 = websocket
            await add_player(websocket, 'O')
        else:
            # observer
            pass

        if player1 and player2:
            await start_new_match()

        logging.debug('Waiting for messages')
        async for message in websocket:
            logging.debug('Message received')
            data = json.loads(message)
            await handle_message(websocket, data)
    finally:
        logging.info(f'Websocket {websocket} disconnecting')
        connected.remove(websocket)
        if websocket is player1:
            logging.info('Player1 has left. Ending game now...')
            player1 = None
            await end_game()
        elif websocket is player2:
            logging.info('Player2 has left. Ending game now...')
            player2 = None
            await end_game()

start_server = websockets.serve(connection_handler, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.ensure_future(check_for_expired_turns())
asyncio.get_event_loop().run_forever()