import './carTrack.css';
import Component from '../../common/component';
import Button from '../../common/button/button';
import { Car } from '../../types/types';
import appController from '../../controllers/appController';

export default class CarTrack extends Component {
    carControls: Component;

    selectButton: Button;

    removeButton: Button;

    carName: Component;

    engineControls: Component;

    startEngineButton: Component;

    stopEngineButton: Component;

    car: Component;

    flag: Component;

    carId: number;

    constructor(car: Car) {
        super({ tag: 'div', className: 'car-track', text: '' });
        this.carControls = new Component({ tag: 'div', className: 'car_controls' });
        this.selectButton = new Button({
            text: 'SELECT',
            style: 'blue',
            onClick: () => {},
        });
        this.removeButton = new Button({
            text: 'REMOVE',
            style: 'blue',
            onClick: this.removeCar.bind(this),
        });
        this.carName = new Component({ tag: 'p', text: car.name, className: 'car_name' });
        this.engineControls = new Component({ tag: 'div', className: 'engine_controls' });
        this.startEngineButton = new Component({ tag: 'button', text: 'A', className: 'engine_button' });
        this.stopEngineButton = new Component({ tag: 'button', text: 'B', className: 'engine_button engine_button--inactive' });
        this.car = new Component({ tag: 'div', className: 'car' });
        this.flag = new Component({ tag: 'div', className: 'flag' });
        this.carId = car.id;

        this.setupAttributes(car.color);
        this.build();
    }

    async removeCar() {
        await fetch(`http://127.0.0.1:3000/garage/${this.carId}`, {
            method: 'DELETE',
        });
        appController.handleDeleteCar();
    }

    setupAttributes(color: string) {
        this.car.setAttribute('style', `background-color: ${color};`);
    }

    build() {
        this.carControls.appendChildren([this.selectButton, this.removeButton, this.carName]);
        this.engineControls.appendChildren([this.startEngineButton, this.stopEngineButton]);
        this.appendChildren([this.carControls, this.engineControls, this.car, this.flag]);
    }
}
