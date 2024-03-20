import MainScreen from './components/mainScreen/mainScreen';

export default class App {

    mainScreen: MainScreen;

    constructor() {
        this.mainScreen = new MainScreen();
    }

    start() {
        document.querySelector('body')?.append(this.mainScreen.getNode());
    }
}
