import AppScreen from './components/appScreen/appScreen';

export default class App {
    appScreen: AppScreen;

    constructor() {
        this.appScreen = new AppScreen();
    }

    start() {
        document.querySelector('body')?.append(this.appScreen.getNode());
    }
}
