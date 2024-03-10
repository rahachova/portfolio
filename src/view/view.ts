import MainScreen from './components/mainScreen/mainScreen';
import ModalWindow from './components/modalWindow/modalWindow';
import StartScreen from './components/startScreen/startScreen';

export default class View {
    modalWindow: ModalWindow;

    mainScreen: MainScreen;

    startScreen: StartScreen;

    constructor() {
        this.modalWindow = new ModalWindow();
        this.mainScreen = new MainScreen();
        this.startScreen = new StartScreen();
    }

    init() {
        document
            .querySelector('body')
            ?.append(
                this.modalWindow.getNode(),
                this.mainScreen.getNode(),
                this.startScreen.getNode()
            );
    }
}
