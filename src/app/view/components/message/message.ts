import { v4 as uuidv4 } from 'uuid';
import Component from '../../../common/component';
import { Message, PublishSubscribeEvent, WSMessage, WSMessageType, WSPayload } from '../../../types/types';
import PS from '../../../common/publishSubscribe';
import './message.css';

export default class MessageComponent extends Component {
    messageElement: Component;

    messageInner: Component;

    messageTopInfo: Component;

    messageBottomInfo: Component;

    sendingTime: Component;

    senderName: Component;

    deliveryStatus: Component;

    editStatus: Component;

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
        this.messageInner = new Component({ tag: 'div', className: 'message_inner' });
        this.messageTopInfo = new Component({ tag: 'div', className: 'message_top-info' });
        this.messageBottomInfo = new Component({ tag: 'div', className: 'message_bottom-info' });
        this.senderName = new Component({ tag: 'div', className: 'message_sender-name' });
        this.deliveryStatus = new Component({ tag: 'div', className: 'message_delivery-status' });
        this.editStatus = new Component({ tag: 'div', className: 'message_edit-status' });
        this.sendingTime = new Component({ tag: 'div', className: 'message_sending-time' });
        this.messageButtons = new Component({ tag: 'div', className: 'message-buttons' });
        this.editButton = new Component({ tag: 'button', className: 'message-button message-button--edit' });
        this.deleteButton = new Component({ tag: 'button', className: 'message-button message-button--delete' });

        this.setData();
        this.setClasses();
        this.setListeners();
        this.setAttributes();
        this.setupSubscribtions();
        this.build();
    }

    setData() {
        const { datetime, to, status } = this.message;
        const date = new Date(datetime);
        this.sendingTime.setTextContent(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
        const senderName = to === this.interlocutorName ? 'You' : this.interlocutorName;
        this.senderName.setTextContent(senderName);
        const editStatus = status.isEdited ? 'Edited' : '';
        this.editStatus.setTextContent(editStatus);
        if (this.message.to === this.interlocutorName) {
            let deliveryStatus;
            if (status.isDelivered && !status.isReaded) {
                deliveryStatus = 'Delivered';
            } else if (status.isReaded) {
                deliveryStatus = 'Read';
            } else {
                deliveryStatus = 'Sent';
            }
            this.deliveryStatus.setTextContent(deliveryStatus);
        }
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

    handleEdit() {
        PS.sendEvent(PublishSubscribeEvent.StartMessageEdit, { text: this.message.text, id: this.message.id });
    }

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

    editMessage(payload: WSPayload) {
        if (payload.message?.id === this.message.id) {
            this.messageElement.setTextContent(payload.message.text);
            this.editStatus.setTextContent('Edited');
        }
    }

    editDeliveryStatusChange(payload: WSPayload) {
        if (payload.message?.id === this.message.id) {
            let deliveryStatus;
            if (payload.message?.status.isDelivered && !payload.message?.status.isReaded) {
                deliveryStatus = 'Delivered';
            } else if (payload.message?.status.isReaded) {
                deliveryStatus = 'Read';
            } else {
                deliveryStatus = 'Sent';
            }
            this.deliveryStatus.setTextContent(deliveryStatus);
        }
    }

    setListeners() {
        this.editButton.addListener('click', this.handleEdit.bind(this));
        this.deleteButton.addListener('click', this.handleDelete.bind(this));
    }

    setAttributes() {
        this.setDataAttribute('isReaded', this.message.status.isReaded);
        this.setDataAttribute('id', this.message.id);
        this.setDataAttribute('isIncome', this.message.from === this.interlocutorName);
    }

    setupSubscribtions() {
        PS.subscribe(PublishSubscribeEvent.WSMessageReceived, this.listenSocket.bind(this));
    }

    listenSocket(data: WSMessage) {
        switch (data.type) {
            case WSMessageType.MSG_EDIT:
                this.editMessage(data.payload);
                break;
            case WSMessageType.MSG_DELIVER:
                this.editDeliveryStatusChange(data.payload);
                break;
            case WSMessageType.MSG_READ:
                this.editDeliveryStatusChange(data.payload);
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
        this.messageTopInfo.appendChildren([this.senderName, this.sendingTime]);
        this.messageBottomInfo.appendChildren([this.editStatus, this.deliveryStatus]);
        this.messageInner.appendChildren([this.messageTopInfo, this.messageElement, this.messageBottomInfo]);
        this.append(this.messageInner);
    }
}
