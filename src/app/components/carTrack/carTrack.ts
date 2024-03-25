import './carTrack.css';
import Component from '../../common/component';
import Button from '../../common/button/button';
import { Car, CarStart } from '../../types/types';
import appController from '../../controllers/appController';

export default class CarTrack extends Component {
    carControls: Component;

    selectButton: Button;

    removeButton: Button;

    carName: Component;

    engineControls: Component;

    startEngineButton: Component;

    stopEngineButton: Component;

    carRoad: Component;

    car: Component;

    flag: Component;

    carData: Car;

    animationStart: DOMHighResTimeStamp = 1;

    duration: number = 1;

    animationRequest: number = 1;

    constructor(car: Car) {
        super({ tag: 'div', className: 'car-track', text: '' });
        this.carControls = new Component({ tag: 'div', className: 'car_controls' });
        this.selectButton = new Button({
            text: 'SELECT',
            style: 'blue',
            onClick: this.selectCar.bind(this),
        });
        this.removeButton = new Button({
            text: 'REMOVE',
            style: 'blue',
            onClick: this.removeCar.bind(this),
        });
        this.carName = new Component({ tag: 'p', text: car.name, className: 'car_name' });
        this.engineControls = new Component({ tag: 'div', className: 'engine_controls' });
        this.startEngineButton = new Component({ tag: 'button', text: 'A', className: 'engine_button' });
        this.stopEngineButton = new Component({ tag: 'button', text: 'B', className: 'engine_button' });
        this.carRoad = new Component({ tag: 'div', className: 'car-road' });
        this.car = new Component({ tag: 'div', className: 'car' });
        this.flag = new Component({ tag: 'div', className: 'flag' });
        this.carData = car;

        this.setupListeners();
        this.setupAttributes(car.color);
        this.build();
    }

    async handleStartEngine() {
        this.startEngineButton.getNode().setAttribute('disabled', 'true');
        const startResponse = await fetch(`http://127.0.0.1:3000/engine?id=${this.carData.id}&status=started`, {
            method: 'PATCH',
        });
        const carStartData = (await startResponse.json()) as CarStart;
        this.stopEngineButton.getNode().removeAttribute('disabled');

        this.animateCar(carStartData);
        const driveResponse = await this.handleDrive();

        if (driveResponse.status === 500) {
            this.stopAnimation();
        }
    }

    async handleStopEngine() {
        this.stopEngineButton.getNode().setAttribute('disabled', 'true');
        this.startEngineButton.getNode().removeAttribute('disabled');
        this.stopAnimation();
        await fetch(`http://127.0.0.1:3000/engine?id=${this.carData.id}&status=stopped`, { method: 'PATCH' });
        this.car.getNode().style.left = '0';
    }

    handleDrive() {
        return fetch(`http://127.0.0.1:3000/engine?id=${this.carData.id}&status=drive`, { method: 'PATCH' });
    }

    async removeCar() {
        await fetch(`http://127.0.0.1:3000/garage/${this.carData.id}`, {
            method: 'DELETE',
        });
        appController.handleDeleteCar();
    }

    stopAnimation() {
        cancelAnimationFrame(this.animationRequest);
    }

    animateCar({ distance, velocity }: CarStart) {
        this.animationStart = performance.now();
        this.duration = distance / velocity;

        this.animationRequest = requestAnimationFrame(this.animate.bind(this));
    }

    animate(time: number) {
        let timeFraction = (time - this.animationStart) / this.duration;
        if (timeFraction > 1) timeFraction = 1;

        this.car.getNode().style.left = `${timeFraction * 100}%`;

        if (timeFraction < 1) {
            this.animationRequest = requestAnimationFrame(this.animate.bind(this));
        }
    }

    selectCar() {
        appController.handleSelectCar(this.carData);
    }

    setupListeners() {
        this.startEngineButton.addListener('click', this.handleStartEngine.bind(this));
        this.stopEngineButton.addListener('click', this.handleStopEngine.bind(this));
    }

    setupAttributes(color: string) {
        this.stopEngineButton.getNode().setAttribute('disabled', 'true');
        this.car.setAttribute('style', `background-color: ${color};`);
    }

    build() {
        this.carControls.appendChildren([this.selectButton, this.removeButton, this.carName]);
        this.engineControls.appendChildren([this.startEngineButton, this.stopEngineButton]);
        this.carRoad.append(this.car);
        this.appendChildren([this.carControls, this.engineControls, this.carRoad, this.flag]);
    }
}
