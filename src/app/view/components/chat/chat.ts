import Button from '../../../common/button/button';
import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import { PublishSubscribeEvent } from '../../../types/types';
import './chat.css';

export default class Chat extends Component {
    messageStory: Component;

    inputContainer: Component;

    inputMessage: Component;

    sendButton: Button;

    constructor() {
        super({ tag: 'div', className: 'chat' });

        this.messageStory = new Component({
            tag: 'div',
            className: 'message-story',
        });

        this.inputContainer = new Component({
            tag: 'div',
            className: 'input-container',
        });
        this.inputMessage = new Component({
            tag: 'input',
            className: 'input-message',
        });
        this.sendButton = new Button({
            text: 'Send',
            onClick: () => {},
        });

        // this.setupSubscribtion();
        // this.setupListeners();
        this.setupAttribute();
        this.build();
    }

    setupAttribute() {
        this.inputMessage.setAttribute('placeholder', 'Write a message...');
    }

    build() {
        this.inputContainer.appendChildren([this.inputMessage, this.sendButton]);
        this.appendChildren([this.messageStory, this.inputContainer]);
    }
}
