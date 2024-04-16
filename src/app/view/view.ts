import MainScreen from './components/mainScreen/mainScreen';
import ModalWindow from './components/modalWindow/modalWindow';
import Spinner from './components/spinner/spinner';

export default class View {
    modalWindow: ModalWindow;

    mainScreen: MainScreen;

    spinner: Spinner;

    constructor() {
        this.modalWindow = new ModalWindow();
        this.mainScreen = new MainScreen();
        this.spinner = new Spinner();
    }

    init() {
        document.querySelector('body')?.append(this.modalWindow.getNode(), this.mainScreen.getNode(), this.spinner.getNode());
    }
}
