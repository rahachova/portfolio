import './appScreen.css';
import Component from '../../common/component';
import Header from '../header/header';
import MainScreen from '../mainScreen/mainScreen';
import appController from '../../controllers/appController';
import Button from '../../common/button/button';

export default class AppScreen extends Component {
    header: Component;

    mainScreen: MainScreen;

    modal: Component;

    modalInner: Component;

    modalContent: Component;

    modalClose: Button;

    constructor() {
        super({ tag: 'div', className: 'app-screen' });
        this.header = new Header();
        this.mainScreen = new MainScreen();
        this.modal = new Component({ tag: 'div', className: 'modal' });
        this.modalInner = new Component({ tag: 'div', className: 'modal-inner' });
        this.modalContent = new Component({ tag: 'div', className: 'modal-content' });
        this.modalClose = new Button({ text: 'Close', style: 'green', onClick: this.closeModal.bind(this) });

        this.setupSubscriptions();
        this.buid();
    }

    closeModal() {
        this.modal.removeClass('modal--visible');
    }

    setupSubscriptions() {
        appController.onRaceWin((message: string | undefined) => {
            if (message) {
                this.modal.addClass('modal--visible');
                this.modalContent.setTextContent(message);
            }
        });
    }

    buid() {
        this.modalInner.appendChildren([this.modalClose, this.modalContent]);
        this.modal.append(this.modalInner);
        this.appendChildren([this.header, this.mainScreen, this.modal]);
    }
}
