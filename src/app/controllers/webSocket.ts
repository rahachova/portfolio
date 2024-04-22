import PS from '../common/publishSubscribe';
import { PublishSubscribeEvent } from '../types/types';

const SERVER_URL = 'ws://localhost:4000';
export class WebSocketClient {
    private url: string;

    private socket: WebSocket;

    constructor() {
        this.url = SERVER_URL;
        this.socket = new WebSocket(this.url);
        this.socket.onopen = WebSocketClient.onOpen;
        this.socket.onmessage = WebSocketClient.onMessage;
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.setupSubscriptions();
    }

    reconnect() {
        this.socket = new WebSocket(this.url);
        this.socket.onopen = WebSocketClient.onOpen;
        this.socket.onmessage = WebSocketClient.onMessage;
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
    }

    static onOpen() {
        PS.sendEvent(PublishSubscribeEvent.WSConnect);
    }

    static onMessage(event: MessageEvent) {
        PS.sendEvent(PublishSubscribeEvent.WSMessageReceived, JSON.parse(event.data));
    }

    onClose() {
        PS.sendEvent(PublishSubscribeEvent.WSDisconnect);
        setTimeout(this.reconnect.bind(this), 2000);
    }

    onError() {
        PS.sendEvent(PublishSubscribeEvent.WSDisconnect);
        this.close();
    }

    send(message: Object) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
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
