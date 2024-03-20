import './header.css';
import Component from '../../common/component';
import Button from '../../common/button/button';
import appController from '../../controllers/appController';

export default class Header extends Component {
    toGarageButton: Button;

    toWinnersButton: Button;

    constructor() {
        super({ tag: 'header', className: 'header' });
        this.toGarageButton = new Button({
            text: 'TO GARAGE',
            style: 'green',
            onClick: appController.handleGarageNavigate.bind(appController),
        });
        this.toWinnersButton = new Button({
            text: 'TO WINNERS',
            style: 'green',
            onClick: appController.handleWinnersNavigate.bind(appController),
        });

        this.buid();
    }

    buid() {
        this.appendChildren([this.toGarageButton, this.toWinnersButton]);
    }
}
