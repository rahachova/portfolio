import { v4 as uuidv4 } from 'uuid';
import Component from '../../../common/component';
import { Message, PublishSubscribeEvent, WSMessage, WSMessageType, WSPayload } from '../../../types/types';
import PS from '../../../common/publishSubscribe';
import './message.css';

export default class MessageComponent extends Component {
    messageElement: Component;

    messageButtons: Component;

    editButton: Component;

    deleteButton: Component;

    message: Message;

    interlocutorName: string;

    constructor(message: Message, interlocutorName: string) {
        super({ tag: 'div', className: 'message--outer' });

        this.message = message;
        this.interlocutorName = interlocutorName;
        this.messageElement = new Component({ tag: 'div', className: 'message', text: message.text });
        this.messageButtons = new Component({ tag: 'div', className: 'message-buttons' });
        this.editButton = new Component({ tag: 'button', className: 'message-button message-button--edit' });
        this.deleteButton = new Component({ tag: 'button', className: 'message-button message-button--delete' });

        this.setClasses();
        this.setListeners();
        this.setAttributes();
        this.build();
    }

    setClasses() {
        if (this.message.from === this.interlocutorName) {
            this.addClass('message--from');
        } else {
            this.addClass('message--to');
        }
        if (!this.message.status.isReaded && this.message.from === this.interlocutorName) {
            this.addClass('message--unread');
        }
    }

    handleEdit() {}

    handleDelete() {
        PS.sendEvent(PublishSubscribeEvent.WSMessage, {
            id: uuidv4(),
            type: WSMessageType.MSG_DELETE,
            payload: {
                message: {
                    id: this.message.id,
                },
            },
        });
    }

    editMessage(payload: WSPayload) {}

    setListeners() {
        this.editButton.addListener('click', this.handleEdit.bind(this));
        this.deleteButton.addListener('click', this.handleDelete.bind(this));
    }

    setAttributes() {
        this.setDataAttribute('isReaded', this.message.status.isReaded);
        this.setDataAttribute('id', this.message.id);
        this.setDataAttribute('isIncome', this.message.from === this.interlocutorName);
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.WSMessageReceived, this.listenSocket.bind(this));
    }

    listenSocket(data: WSMessage) {
        switch (data.type) {
            case WSMessageType.MSG_DELETE:
                this.editMessage(data.payload);
                break;
            default:
                break;
        }
    }

    build() {
        this.messageButtons.appendChildren([this.deleteButton, this.editButton]);
        if (this.message.to === this.interlocutorName) {
            this.append(this.messageButtons);
        }
        this.append(this.messageElement);
    }
}
