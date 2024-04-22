import MainScreen from './components/mainScreen/mainScreen';
import ModalWindow from './components/modalWindow/modalWindow';
import Spinner from './components/spinner/spinner';
import About from './components/about/about';

export default class View {
    modalWindow: ModalWindow;

    mainScreen: MainScreen;

    spinner: Spinner;

    about: About;

    constructor() {
        this.modalWindow = new ModalWindow();
        this.mainScreen = new MainScreen();
        this.spinner = new Spinner();
        this.about = new About();
    }

    init() {
        document
            .querySelector('body')
            ?.append(this.modalWindow.getNode(), this.mainScreen.getNode(), this.spinner.getNode(), this.about.getNode());
    }
}
