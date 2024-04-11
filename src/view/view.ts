import MainScreen from './components/mainScreen/mainScreen';
import ModalWindow from './components/modalWindow/modalWindow';

export default class View {
    modalWindow: ModalWindow;

    mainScreen: MainScreen;

    constructor() {
        this.modalWindow = new ModalWindow();
        this.mainScreen = new MainScreen();
    }

    init() {
        document.querySelector('body')?.append(this.modalWindow.getNode(), this.mainScreen.getNode());
    }
}
