import './appScreen.css';
import Component from '../../common/component';
import Header from '../header/header';
import MainScreen from '../mainScreen/mainScreen';

export default class AppScreen extends Component {
    header: Component;

    mainScreen: MainScreen;

    constructor() {
        super({ tag: 'div', className: 'app-screen' });
        this.header = new Header();
        this.mainScreen = new MainScreen();

        this.buid();
    }

    buid() {
        this.appendChildren([this.header, this.mainScreen]);
    }
}
