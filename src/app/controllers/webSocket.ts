import PS from '../common/publishSubscribe';
import { PublishSubscribeEvent } from '../types/types';

export class WebSocketClient {
    private url: string;

    private socket: WebSocket;

    constructor() {
        this.url = 'ws://localhost:4000';
        this.socket = new WebSocket(this.url);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.setupSubscriptions();
    }

    reconnect() {
        this.socket = new WebSocket(this.url);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.setupSubscriptions();
    }

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    onOpen(event: Event) {
        PS.sendEvent(PublishSubscribeEvent.WSConnect);
        console.debug('WebSocket connection established.');
    }

    // eslint-disable-next-line class-methods-use-this
    onMessage(event: MessageEvent) {
        console.debug('Message received:', event.data);
        PS.sendEvent(PublishSubscribeEvent.WSMessageReceived, JSON.parse(event.data));
        // Handle incoming messages here
    }

    onClose(event: CloseEvent) {
        PS.sendEvent(PublishSubscribeEvent.WSDisconnect);
        setTimeout(this.reconnect.bind(this), 2000);
        console.debug('WebSocket connection closed:', event.reason);
    }

    onError(event: Event) {
        PS.sendEvent(PublishSubscribeEvent.WSDisconnect);
        this.close();
        console.error('WebSocket error:', event);
    }

    send({ message }: { message: string }) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.error('WebSocket connection not open.');
        }
    }

    close() {
        this.socket.close();
    }

    setupSubscriptions() {
        PS.subscribe(PublishSubscribeEvent.WSMessage, this.send.bind(this));
    }
}

export default new WebSocketClient();
