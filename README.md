# tic-tac-toe-but

## List of Other Possible Names
* tic-tic-tic

## Backend
Use Python **3.7** because we don't use inferior versions.

To kill the python process on Windows: `taskkill /PID <pid> /F`

To run python tests (because we're cool): `python -m unittest`

### How to run:
1. Build the docker image: `docker build -t tic-tac-toe-but .`
2. Run the docker image: `docker run --rm --name tic-tac-toe-but -d -p 8765:8765 -v /etc/letsencrypt/live/{FOLDER} tic-tac-toe-but` to run the container in the background and to publish the container's ports
3. Make sure traffic to port `8765` is allowed in your firewall settings
