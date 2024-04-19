import Button from '../../../common/button/button';
import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import { Message, PublishSubscribeEvent, WSMessage, WSMessageType, WSPayload } from '../../../types/types';
import { v4 as uuidv4 } from 'uuid';
import './chat.css';

export default class Chat extends Component {
    interlocutorInfo: Component;

    interlocutorName: Component;

    interlocutorStatus: Component;

    messageStory: Component;

    messagesPlaceholder: Component;

    inputContainer: Component;

    inputMessage: Component;

    sendButton: Button;

    activeInterlocutorName: string = '';

    isHistoryEmpty: boolean = false;

    constructor() {
        super({ tag: 'div', className: 'chat' });

        this.interlocutorInfo = new Component({
            tag: 'div',
            className: 'interlocutor_info',
        });

        this.interlocutorName = new Component({
            tag: 'p',
            className: 'interlocutor_name',
        });

        this.interlocutorStatus = new Component({
            tag: 'p',
            className: 'interlocutor_status--online',
        });

        this.messageStory = new Component({
            tag: 'div',
            className: 'message_story',
        });

        this.messagesPlaceholder = new Component({
            tag: 'div',
            className: 'messages_placeholder',
            text: 'Choose interlocutor to send a message',
        });

        this.inputContainer = new Component({
            tag: 'div',
            className: 'input_container',
        });
        this.inputMessage = new Component({
            tag: 'input',
            className: 'input_message',
        });
        this.sendButton = new Button({
            text: 'Send',
            onClick: this.sendMessage.bind(this),
        });
        this.setupAttribute();
        this.setupListeners();
        this.setupSubscribtion();
        this.build();
    }

    getMessages() {
        PS.sendEvent(PublishSubscribeEvent.WSMessage, {
            id: uuidv4(),
            type: WSMessageType.MSG_FROM_USER,
            payload: {
                user: {
                    login: this.activeInterlocutorName,
                },
            },
        });
    }

    sendMessage() {
        PS.sendEvent(PublishSubscribeEvent.WSMessage, {
            id: uuidv4(),
            type: WSMessageType.MSG_SEND,
            payload: {
                message: {
                    to: this.activeInterlocutorName,
                    text: (this.inputMessage.getNode() as HTMLInputElement).value,
                },
            },
        });
        (this.inputMessage.getNode() as HTMLInputElement).value = '';
    }

    renderDialogue(payload: { login: string; active: boolean }) {
        const { login, active } = payload;
        this.activeInterlocutorName = login;
        this.interlocutorName.setTextContent(login);
        this.interlocutorStatus.setTextContent(active ? 'online' : 'offline');
        this.interlocutorStatus.removeClasses(['interlocutor_status--online', 'interlocutor_status--offline']);
        this.inputMessage.removeAttribute('disabled');
        this.sendButton.removeAttribute('disabled');
        this.interlocutorStatus.addClass(active ? 'interlocutor_status--online' : 'interlocutor_status--offline');
        this.getMessages();
    }

    createMessage(message: Message) {
        const messageElement = new Component({ tag: 'div', className: 'message', text: message.text });
        if (message.from === this.activeInterlocutorName) {
            messageElement.addClass('message--from');
        } else {
            messageElement.addClass('message--to');
        }
        return messageElement;
    }

    renderMessages(payload: WSPayload) {
        const messages = payload.messages?.map(this.createMessage.bind(this));
        this.messageStory.destroyChildren();
        if (messages?.length) {
            this.messageStory.appendChildren(messages);
            messages[messages.length - 1].getNode().scrollIntoView();
        } else {
            const messagesPlaceholder = new Component({
                tag: 'div',
                className: 'messages_placeholder',
                text: 'Type something to start conversation',
            });
            this.isHistoryEmpty = true;
            this.messageStory.append(messagesPlaceholder);
        }
    }

    renderNewMessage(payload: WSPayload) {
        if (payload.message) {
            if (this.isHistoryEmpty) {
                debugger;
                this.messageStory.destroyChildren();
                this.isHistoryEmpty = false;
            }
            const messageElement = this.createMessage(payload.message);
            this.messageStory.append(messageElement);
            messageElement.getNode().scrollIntoView();
        }
    }

    setupAttribute() {
        this.inputMessage.setAttribute('placeholder', 'Write a message...');
        this.inputMessage.setAttribute('disabled', 'true');
        this.sendButton.setAttribute('disabled', 'true');
    }

    setupListeners() {
        this.inputMessage.getNode().addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.SelectInterlocutor, this.renderDialogue.bind(this));
        PS.subscribe(PublishSubscribeEvent.WSMessageReceived, this.listenSocket.bind(this));
    }

    listenSocket(data: WSMessage) {
        if (data.type === WSMessageType.MSG_FROM_USER) {
            this.renderMessages(data.payload);
        } else if (data.type === WSMessageType.MSG_SEND) {
            this.renderNewMessage(data.payload);
        }
    }

    build() {
        this.messageStory.append(this.messagesPlaceholder);
        this.interlocutorInfo.appendChildren([this.interlocutorName, this.interlocutorStatus]);
        this.inputContainer.appendChildren([this.inputMessage, this.sendButton]);
        this.appendChildren([this.interlocutorInfo, this.messageStory, this.inputContainer]);
    }
}
