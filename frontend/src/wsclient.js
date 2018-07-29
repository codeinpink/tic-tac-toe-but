export class WSClient {
  constructor(messageHandler) {
    this.ws = new WebSocket("ws://localhost:3000/")
    this.onmessage = ({data}) => {
      messageHandler(data)
    }
  }

  send(data) {
    this.ws.send(JSON.stringify(data))
  }
}
