class WebSocketClient {
    private url: string;

    private socket: WebSocket;

    constructor() {
        this.url = 'ws://localhost:4000';
        this.socket = new WebSocket(this.url);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
    }

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    onOpen(event: Event) {
        console.log('WebSocket connection established.');
    }

    // eslint-disable-next-line class-methods-use-this
    onMessage(event: MessageEvent) {
        console.log('Message received:', event.data);
        // Handle incoming messages here
    }

    // eslint-disable-next-line class-methods-use-this
    onClose(event: CloseEvent) {
        console.log('WebSocket connection closed:', event.reason);
    }

    // eslint-disable-next-line class-methods-use-this
    onError(event: Event) {
        console.error('WebSocket error:', event);
    }

    send(message: string) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.error('WebSocket connection not open.');
        }
    }

    close() {
        this.socket.close();
    }
}

export default new WebSocketClient();
