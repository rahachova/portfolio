import './garagePage.css';
import Component from '../../common/component';
import GarageControls from '../garageControls/garageControls';
import Garage from '../garage/garage';

export default class GaragePage extends Component {
    garageControls: GarageControls;

    garage: Garage;

    constructor() {
        super({ tag: 'div', className: 'garage-page', text: '' });
        this.garageControls = new GarageControls();
        this.garage = new Garage();

        this.build();
    }

    build() {
        this.appendChildren([this.garageControls, this.garage]);
    }
}