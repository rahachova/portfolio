import { v4 as uuidv4 } from 'uuid';
import Button from '../../../common/button/button';
import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import { Message, PublishSubscribeEvent, WSMessage, WSMessageType, WSPayload } from '../../../types/types';
import './chat.css';

export default class Chat extends Component {
    interlocutorInfo: Component;

    interlocutorName: Component;

    interlocutorStatus: Component;

    messageStory: Component;

    messageStoryOuter: Component;

    messagesPlaceholder: Component;

    inputContainer: Component;

    inputMessage: Component;

    sendButton: Button;

    activeInterlocutorName: string = '';

    isHistoryEmpty: boolean = false;

    hasUnread: boolean = false;

    isScrollIntoView: boolean = false;

    messagesHistoryRequestId: string | undefined;

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

        this.messageStoryOuter = new Component({
            tag: 'div',
            className: 'message_story--outer',
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
        this.messagesHistoryRequestId = uuidv4();

        PS.sendEvent(PublishSubscribeEvent.WSMessage, {
            id: this.messagesHistoryRequestId,
            type: WSMessageType.MSG_FROM_USER,
            payload: {
                user: {
                    login: this.activeInterlocutorName,
                },
            },
        });
    }

    sendMessage() {
        this.markAllReaded();
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
        this.hasUnread = false;
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
        this.hasUnread = message.from === this.activeInterlocutorName && !message.status.isReaded;
        const messageElementOuter = new Component({ tag: 'div', className: 'message--outer' });
        messageElementOuter.setDataAttribute('isReaded', message.status.isReaded);
        messageElementOuter.setDataAttribute('id', message.id);
        messageElementOuter.setDataAttribute('isIncome', message.from === this.activeInterlocutorName);
        const messageElement = new Component({ tag: 'div', className: 'message', text: message.text });
        if (message.from === this.activeInterlocutorName) {
            messageElementOuter.addClass('message--from');
        } else {
            messageElementOuter.addClass('message--to');
        }
        if (!message.status.isReaded && message.from === this.activeInterlocutorName) {
            messageElementOuter.addClass('message--unread');
        }
        messageElementOuter.append(messageElement);
        return messageElementOuter;
    }

    renderMessages({ id, payload }: WSMessage) {
        if (id !== this.messagesHistoryRequestId) return;
        const messages = payload.messages?.map(this.createMessage.bind(this));
        this.messageStory.destroyChildren();
        if (messages?.length) {
            this.messageStory.appendChildren(messages);
            this.isScrollIntoView = true;
            const firstUnreadMessage = messages.find(
                (message) => message.getDataAttribute('isIncome') && !message.getDataAttribute('isReaded')
            );
            if (firstUnreadMessage) {
                firstUnreadMessage.getNode().scrollIntoView();
            } else {
                messages[messages.length - 1].getNode().scrollIntoView();
            }
            this.isHistoryEmpty = false;
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
        const isMessageAppliesToCurrentDialogue =
            this.activeInterlocutorName === payload.message?.from || this.activeInterlocutorName === payload.message?.to;
        if (!isMessageAppliesToCurrentDialogue) {
            return;
        }
        if (payload.message) {
            if (this.isHistoryEmpty) {
                this.messageStory.destroyChildren();
                this.isHistoryEmpty = false;
            }
            const isScrollNeeded = !this.hasUnread;
            const messageElement = this.createMessage(payload.message);
            this.messageStory.append(messageElement);
            if (isScrollNeeded) {
                this.isScrollIntoView = true;
                messageElement.getNode().scrollIntoView();
            }
        }
    }

    handleScroll(event: Event) {
        if (this.isScrollIntoView) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            this.isScrollIntoView = false;
        } else {
            this.markAllReaded();
        }
    }

    markAllReaded() {
        if (this.hasUnread) {
            this.messageStory.getChildren().forEach((messageElement) => {
                const isReaded = messageElement.getDataAttribute('isReaded');
                const id = messageElement.getDataAttribute('id');
                const isIncome = messageElement.getDataAttribute('isIncome');
                if (!isReaded && isIncome) {
                    PS.sendEvent(PublishSubscribeEvent.WSMessage, {
                        id: uuidv4(),
                        type: WSMessageType.MSG_READ,
                        payload: {
                            message: {
                                id,
                            },
                        },
                    });
                }
            });
            this.hasUnread = false;
        }
    }

    updateReadStatus(payload: WSPayload) {
        const messageToUpdate = this.messageStory
            .getChildren()
            .find((messageElement) => messageElement.getDataAttribute('id') === payload.message?.id);

        const isReaded = payload.message?.status.isReaded;
        messageToUpdate?.setDataAttribute('isReaded', Boolean(isReaded));
        if (isReaded) {
            messageToUpdate?.removeClass('message--unread');
        } else {
            messageToUpdate?.addClass('message--unread');
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
        this.messageStoryOuter.addListener('click', this.markAllReaded.bind(this));
        this.messageStoryOuter.addListener('scroll', this.handleScroll.bind(this));
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.SelectInterlocutor, this.renderDialogue.bind(this));
        PS.subscribe(PublishSubscribeEvent.WSMessageReceived, this.listenSocket.bind(this));
    }

    listenSocket(data: WSMessage) {
        if (data.type === WSMessageType.MSG_FROM_USER) {
            this.renderMessages(data);
        } else if (data.type === WSMessageType.MSG_SEND) {
            this.renderNewMessage(data.payload);
        } else if (data.type === WSMessageType.MSG_READ) {
            this.updateReadStatus(data.payload);
        }
    }

    build() {
        this.messageStoryOuter.append(this.messageStory);
        this.messageStory.append(this.messagesPlaceholder);
        this.interlocutorInfo.appendChildren([this.interlocutorName, this.interlocutorStatus]);
        this.inputContainer.appendChildren([this.inputMessage, this.sendButton]);
        this.appendChildren([this.interlocutorInfo, this.messageStoryOuter, this.inputContainer]);
    }
}
