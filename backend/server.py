import asyncio
import logging
import re
import websockets
from session import Session

logger = logging.getLogger(__name__)

class MatchMaker:
    def __init__(self):
        self.pending_session = Session()
        self.waiting_ws = set()

    async def connect(self, ws):
        if self.pending_session.game_started:
            logger.info('Creating a new session')
            self.pending_session = Session()
            self.waiting_ws.clear()

        logger.info('Adding player to session')
        self.waiting_ws.add(ws)
        await self.pending_session.play(ws)

    async def disconnect(self, ws):
        if ws in self.waiting_ws:
            logger.info('Scrapping pending session')
            self.waiting_ws.clear()
            self.pending_session = Session()

class Controller:
    def __init__(self):
        self.match_maker = MatchMaker()

    async def match_me(self, ws):
        logger.info(f'Player requests match')
        try:
            await self.match_maker.connect(ws)
        finally:
            await self.match_maker.disconnect(ws)

def create_connection_handler(controller):
    async def connection_handler(ws, path):
        try:
            if path.endswith('/match-me'):
                await controller.match_me(ws)
            else:
                raise Exception(f'Unknown route: {path}')
        except Exception:
            logging.exception('Connection error')
        finally:
            logger.info(f'Closing connection')
            ws.close()
    return connection_handler

if __name__ == '__main__':
    logging.basicConfig(filename='log.txt', filemode='w', format='%(levelname)s (%(asctime)s): %(message)s', level=logging.INFO)

    controller = Controller()
    start_server = websockets.serve(create_connection_handler(controller), '0.0.0.0', 8765)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
