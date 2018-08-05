export class WSClient {
  constructor (uri, messageHandler) {
    this.ws = new WebSocket(uri)
    this.ws.onmessage = ({data}) => {
      messageHandler(data)
    }
  }

  send (data) {
    this.ws.send(JSON.stringify(data))
  }
}
