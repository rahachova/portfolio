import './winnersPage.css';
import Component from '../../common/component';

export default class WinnersPage extends Component {
    constructor() {
        super({ tag: 'div', className: 'winners-page winners-page--hidden', text: '' });
    }

    hide() {
        this.addClass('winners-page--hidden');
    }

    show() {
        this.removeClass('winners-page--hidden');
    }
}
