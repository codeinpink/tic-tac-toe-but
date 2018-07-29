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
game = TicTacToe()

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

async def handle_cell_clicked(websocket, message):
    id = message['board-id']
    cell = message['cell']
    row = int(cell['r'])
    col = int(cell['c'])

    player = get_player_token(websocket)

    if not player: return

    done = game.next_turn(player, row, col)
    placed_data = {
        'piece-placed':  {
            'board-id': id,
            'cell': cell,
            'piece': player
        }
    }
    await websocket.send(json.dumps(placed_data))

    if done:
        winner = game.winner if game.winner else 'tied'
        ended_data = {
            'board-ended': {
                'board-id': id,
                'winner': winner
            }
        }
        await websocket.send(json.dumps(ended_data))

async def start_turn(new_player):
    token = get_player_token(new_player)
    if not token: return

    data = {
        'board-turn-changed': {
            'board-id': 1,
            'turn': token,
            'time-limit-ms': '5000'
        }
    }
    await new_player.send(json.dumps(data))

async def start_new_match():
    game = TicTacToe()
    id = 1
    data = {
        'board-started': {
            'board-id': id
        }
    }
    await asyncio.wait([ws.send(json.dumps(data)) for ws in connected])
    await start_turn(get_websocket_from_token(game.turn))

async def add_player(websocket, player):
    data = {
        'game-started': {
            'player-piece': player
        }
    }
    await websocket.send(json.dumps(data))

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

start_server = websockets.serve(connection_handler, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()