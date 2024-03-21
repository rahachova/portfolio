import './garage.css';
import Component from '../../common/component';

export default class Garage extends Component {
    garageHeader: Component;

    garagePageNumber: Component;

    constructor() {
        super({ tag: 'div', className: 'garage', text: '' });
        this.garageHeader = new Component({ tag: 'h2', text: 'Garage', className: 'garage_header' });
        this.garagePageNumber = new Component({ tag: 'h2', text: 'Page #', className: 'garage_page-number' });

        this.build();
    }

    build() {
        this.appendChildren([this.garageHeader, this.garagePageNumber]);
    }
}
