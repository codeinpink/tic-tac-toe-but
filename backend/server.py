import asyncio
import websockets
import json
import random
import datetime
import os


print(f"Process ID: {os.getpid()}")

connected = set()

async def time(websocket, path):
    while True:
        now = datetime.datetime.utcnow().isoformat() + 'Z'
        await websocket.send(now)
        await asyncio.sleep(random.random() * 3)

async def handle_message(websocket, message):
    print(message)
    await websocket.send(json.dumps({'done': 'a'}))

async def connection_handler(websocket, path):
    connected.add(websocket)

    try:
        await asyncio.wait([ws.send('Hello!') for ws in connected])
        async for message in websocket:
            data = json.loads(message)
            await handle_message(websocket, data)
    finally:
        connected.remove(websocket)

start_server = websockets.serve(connection_handler, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()