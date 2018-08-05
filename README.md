# tic-tac-toe-but

## List of Other Possible Names
* tic-tic-tic

## Backend
Use Python **3.7** because we don't use inferior versions.

To kill the python process on Windows: `taskkill /PID <pid> /F`

To run python tests (because we're cool): `python -m unittest`

### How to run:
1. Build the docker image: `docker build -t tic-tac-toe-but .`
2. Run the docker image: `docker run -p 8765:8765 tic-tac-toe-but`
