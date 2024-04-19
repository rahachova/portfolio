import Button from '../../../common/button/button';
import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import { PublishSubscribeEvent } from '../../../types/types';
import './chat.css';

export default class Chat extends Component {
    interlocutorInfo: Component;

    interlocutorName: Component;

    interlocutorStatus: Component;

    messageStory: Component;

    inputContainer: Component;

    inputMessage: Component;

    sendButton: Button;

    constructor() {
        super({ tag: 'div', className: 'chat' });

        this.interlocutorInfo = new Component({
            tag: 'div',
            className: 'interlocutor_info',
        });

        this.interlocutorName = new Component({
            tag: 'p',
            className: 'interlocutor_name',
            text: 'Alia',
        });

        this.interlocutorStatus = new Component({
            tag: 'p',
            className: 'interlocutor_status--online',
            text: 'Online',
        });

        this.messageStory = new Component({
            tag: 'div',
            className: 'message_story',
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
            onClick: () => {},
        });
        this.setupAttribute();
        this.setupSubscribtion();
        this.build();
    }

    renderDialogue(payload: { login: string; active: boolean }) {
        const { login, active } = payload;
        this.interlocutorName.setTextContent(login);
        this.interlocutorStatus.setTextContent(active ? 'online' : 'offline');
        this.interlocutorStatus.removeClasses(['interlocutor_status--online', 'interlocutor_status--offline']);
        this.interlocutorStatus.addClass(active ? 'interlocutor_status--online' : 'interlocutor_status--offline');
    }

    setupAttribute() {
        this.inputMessage.setAttribute('placeholder', 'Write a message...');
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.SelectInterlocutor, this.renderDialogue.bind(this));
    }

    build() {
        this.interlocutorInfo.appendChildren([this.interlocutorName, this.interlocutorStatus]);
        this.inputContainer.appendChildren([this.inputMessage, this.sendButton]);
        this.appendChildren([this.interlocutorInfo, this.messageStory, this.inputContainer]);
    }
}
