import { v4 as uuidv4 } from 'uuid';
import Button from '../../../common/button/button';
import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import { Message, PublishSubscribeEvent, WSMessage, WSMessageType, WSPayload } from '../../../types/types';
import './chat.css';
import MessageComponent from '../message/message';

export default class Chat extends Component {
    interlocutorInfo: Component;

    interlocutorName: Component;

    interlocutorStatus: Component;

    messageStory: Component;

    messageStoryOuter: Component;

    messagesPlaceholder: Component;

    inputHint: Component;

    inputContainer: Component;

    inputMessage: Component;

    sendButton: Button;

    activeInterlocutorName: string = '';

    isHistoryEmpty: boolean = false;

    hasUnread: boolean = false;

    isScrollIntoView: boolean = false;

    isEditMode: boolean = false;

    editMessageId: string = '';

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

        this.inputHint = new Component({
            tag: 'p',
            className: 'input_hint',
            text: 'Edit message:',
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
            onClick: this.submitInput.bind(this),
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

    submitInput() {
        const inputValue = (this.inputMessage.getNode() as HTMLInputElement).value.trim();
        if (inputValue) {
            switch (this.isEditMode) {
                case true:
                    this.editMessage(inputValue);
                    break;
                case false:
                    this.sendMessage(inputValue);
                    break;
                default:
                    break;
            }
        }
    }

    sendMessage(inputValue: string) {
        this.markAllReaded();
        PS.sendEvent(PublishSubscribeEvent.WSMessage, {
            id: uuidv4(),
            type: WSMessageType.MSG_SEND,
            payload: {
                message: {
                    to: this.activeInterlocutorName,
                    text: inputValue,
                },
            },
        });
        (this.inputMessage.getNode() as HTMLInputElement).value = '';
    }

    editMessage(inputValue: string) {
        PS.sendEvent(PublishSubscribeEvent.WSMessage, {
            id: uuidv4(),
            type: WSMessageType.MSG_EDIT,
            payload: {
                message: {
                    id: this.editMessageId,
                    text: inputValue,
                },
            },
        });
        this.isEditMode = false;
        (this.inputMessage.getNode() as HTMLInputElement).value = '';
        this.sendButton.setTextContent('Send');
        this.inputHint.removeClass('input_hint--visible');
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
        return new MessageComponent(message, this.activeInterlocutorName);
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

    startEditMode(payload: { text: string; id: string }) {
        const { text, id } = payload;
        this.isEditMode = true;
        this.editMessageId = id;
        (this.inputMessage.getNode() as HTMLInputElement).value = text;
        this.sendButton.setTextContent('Edit');
        this.inputHint.addClass('input_hint--visible');
    }

    setupAttribute() {
        this.inputMessage.setAttribute('placeholder', 'Write a message...');
        this.inputMessage.setAttribute('disabled', 'true');
        this.sendButton.setAttribute('disabled', 'true');
    }

    setupListeners() {
        this.inputMessage.getNode().addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.submitInput();
            }
        });
        this.messageStoryOuter.addListener('click', this.markAllReaded.bind(this));
        this.messageStoryOuter.addListener('scroll', this.handleScroll.bind(this));
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.StartMessageEdit, this.startEditMode.bind(this));
        PS.subscribe(PublishSubscribeEvent.SelectInterlocutor, this.renderDialogue.bind(this));
        PS.subscribe(PublishSubscribeEvent.WSMessageReceived, this.listenSocket.bind(this));
    }

    handleUserLogin() {
        this.interlocutorStatus.setTextContent('online');
        this.interlocutorStatus.removeClass('interlocutor_status--offline');
        this.interlocutorStatus.addClass('interlocutor_status--online');
    }

    handleUserLogout() {
        this.interlocutorStatus.setTextContent('offline');
        this.interlocutorStatus.removeClass('interlocutor_status--online');
        this.interlocutorStatus.addClass('interlocutor_status--offline');
    }

    deleteMessage(payload: WSPayload) {
        const messageToDelete = this.messageStory
            .getChildren()
            .find((message) => (message as MessageComponent).message.id === payload.message?.id);
        if (messageToDelete) {
            this.messageStory.removeChild(messageToDelete);
        }
    }

    listenSocket(data: WSMessage) {
        switch (data.type) {
            case WSMessageType.MSG_FROM_USER:
                this.renderMessages(data);
                break;
            case WSMessageType.MSG_SEND:
                this.renderNewMessage(data.payload);
                break;
            case WSMessageType.MSG_READ:
                this.updateReadStatus(data.payload);
                break;
            case WSMessageType.USER_EXTERNAL_LOGIN:
                if (data.payload.user?.login === this.activeInterlocutorName) {
                    this.handleUserLogin();
                }
                break;
            case WSMessageType.USER_EXTERNAL_LOGOUT:
                if (data.payload.user?.login === this.activeInterlocutorName) {
                    this.handleUserLogout();
                }
                break;
            case WSMessageType.MSG_DELETE:
                this.deleteMessage(data.payload);
                break;
            default:
                break;
        }
    }

    build() {
        this.messageStoryOuter.append(this.messageStory);
        this.messageStory.append(this.messagesPlaceholder);
        this.interlocutorInfo.appendChildren([this.interlocutorName, this.interlocutorStatus]);
        this.inputContainer.appendChildren([this.inputMessage, this.sendButton]);
        this.appendChildren([this.interlocutorInfo, this.messageStoryOuter, this.inputHint, this.inputContainer]);
    }
}
