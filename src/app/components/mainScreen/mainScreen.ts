import './mainScreen.css';
import Component from '../../common/component';
import Header from '../header/header';

export default class MainScreen extends Component {
    header: Component;

    constructor() {
        super({ tag: 'div', className: 'main-screen' });
        this.header = new Header();

        this.buid();
    }

    buid() {
        this.append(this.header);
    }
}
