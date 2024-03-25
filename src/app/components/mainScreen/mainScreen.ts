import './mainScreen.css';
import Component from '../../common/component';
import GaragePage from '../garagePage/garagePage';
import WinnersPage from '../winnersPage/winnersPage';
import appController from '../../controllers/appController';

export default class MainScreen extends Component {
    garagePage: GaragePage;

    winnersPage: WinnersPage;

    constructor() {
        super({ tag: 'div', className: 'main-screen' });
        this.garagePage = new GaragePage();
        this.winnersPage = new WinnersPage();
        this.setupSubscriptions();
        this.build();
    }

    showGaragePage() {
        this.garagePage.show();
        this.winnersPage.hide();
    }

    showWinnersPage() {
        this.winnersPage.show();
        this.garagePage.hide();
    }

    setupSubscriptions() {
        appController.onGarageNavigate(this.showGaragePage.bind(this));
        appController.onWinnersNavigate(this.showWinnersPage.bind(this));
    }

    build() {
        this.appendChildren([this.garagePage, this.winnersPage]);
    }
}
