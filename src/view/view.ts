import ModalWindow from './components/modalWindow/modalWindow';

export default class View {
    modalWindow: ModalWindow;

    constructor() {
        this.modalWindow = new ModalWindow();
    }

    init() {
        document.querySelector('body')?.append(this.modalWindow.getNode());
    }
}
