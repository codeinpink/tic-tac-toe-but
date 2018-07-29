import asyncio
import websockets
import json
import random
import datetime
import os
from game import TicTacToe


print(f"Process ID: {os.getpid()}")

connected = set()
player1 = None
player2 = None

boards = {}
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
    if 'X':
        return player1
    elif 'O':
        return player2
    else:
        print(f'Unknown token {token}')

async def update_score(x_points, o_points):
    score['X'] = x_points
    score['O'] = o_points

    data = {
        'score-changed': {
            'X': score['X'],
            'O': score['O']
        }
    }

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

    await asyncio.wait([ws.send(json.dumps(data)) for ws in connected])

    if game.winner and game.winner is player1:
        update_score(score['X'] + 1, score['O'])
    elif game.winner and game.winner is player2:
        update_score(score['X'], score['O'] + 1)

async def handle_cell_clicked(websocket, message):
    id = message['board-id']
    cell = message['cell']
    row = int(cell['r'])
    col = int(cell['c'])

    player = get_player_token(websocket)
    if not player:
        print(f'Player for websocket {websocket} not found')
        return

    game = boards.get(id)
    if not game:
        print(f'Game with id {id} not found')
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

async def start_turn(board_id, game_piece):
    data = {
        'board-turn-changed': {
            'board-id': board_id,
            'turn': game_piece,
            'time-limit-ms': '5000'
        }
    }

    await asyncio.wait([ws.send(json.dumps(data)) for ws in connected])

async def start_new_match():
    global latest_id

    game = TicTacToe()
    latest_id = latest_id + 1
    boards[latest_id] = game

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

    await asyncio.wait([ws.send(json.dumps(data)) for ws in connected])

async def handle_message(websocket, message):
    print(message)
    if message['cell-clicked']:
        await handle_cell_clicked(websocket, message['cell-clicked'])

async def connection_handler(websocket, path):
    connected.add(websocket)

    try:
        await asyncio.wait([ws.send('Hello!') for ws in connected])
        global player1, player2

        if not player1:
            player1 = websocket
            await add_player(websocket, 'X')
            
        elif not player2:
            player2 = websocket
            await add_player(websocket, 'O')
        else:
            # observer
            pass

        if player1 and player2:
            await start_new_match()

        async for message in websocket:
            data = json.loads(message)
            await handle_message(websocket, data)
    finally:
        connected.remove(websocket)
        if websocket is player1 or websocket is player2:
            await end_game()

start_server = websockets.serve(connection_handler, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()