import './mainScreen.css';
import Component from '../../common/component';
import GaragePage from '../garagePage/garagePage';
import WinnersPage from '../winnersPage/winnersPage';
import appController from '../../controllers/appController';

export default class MainScreen extends Component {
    constructor() {
        super({ tag: 'div', className: 'main-screen' });
        this.initGaragePage();
        this.setupSubscriptions();
    }

    initGaragePage() {
        this.destroyChildren();
        this.append(new GaragePage());
    }

    initWinnersPage() {
        this.destroyChildren();
        this.append(new WinnersPage());
    }

    setupSubscriptions() {
        appController.onGarageNavigate(this.initGaragePage.bind(this));
        appController.onWinnersNavigate(this.initWinnersPage.bind(this));
    }
}
