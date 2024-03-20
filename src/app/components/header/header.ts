import './header.css';
import Component from '../../common/component';
import Button from '../../common/button/button';

export default class Header extends Component {
    toGarageButton: Button;

    toWinnersButton: Button;

    constructor() {
        super({ tag: 'div', className: 'header' });
        this.toGarageButton = new Button({ text: 'TO GARAGE', style: 'green' });
        this.toWinnersButton = new Button({ text: 'TO WINNERS', style: 'green' });

        this.buid();
    }

    buid() {
        this.appendChildren([this.toGarageButton, this.toWinnersButton]);
    }
}
