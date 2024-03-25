import './garageControls.css';
import Component from '../../common/component';
import Button from '../../common/button/button';
import appController from '../../controllers/appController';
import { Car } from '../../types/types';
import { carColors, carManufacturers, carModels, carQuantityToGenerate } from '../../constants/constants';

export default class GarageControls extends Component {
    createBlock: Component;

    createInput: Component;

    createColorPicker: Component;

    createButton: Button;

    updateBlock: Component;

    updateInput: Component;

    updateButton: Button;

    updateColorPicker: Component;

    mainControls: Component;

    raceButton: Component;

    resetButton: Component;

    generateCarsButton: Component;

    selectedCar: Car | undefined;

    constructor() {
        super({ tag: 'div', className: 'controls' });
        this.createBlock = new Component({ tag: 'div', className: 'controls_block' });
        this.createInput = new Component({ tag: 'input', className: 'controls_input' });
        this.createColorPicker = new Component({ tag: 'input', className: 'controls_color-picker' });
        this.createButton = new Button({
            style: 'blue',
            text: 'CREATE',
            onClick: this.createNewCar.bind(this),
        });

        this.updateBlock = new Component({ tag: 'div', className: 'controls_block' });
        this.updateInput = new Component({ tag: 'input', className: 'controls_input' });
        this.updateColorPicker = new Component({ tag: 'input', className: 'controls_color-picker' });
        this.updateButton = new Button({
            style: 'blue',
            text: 'UPDATE',
            onClick: this.updateCar.bind(this),
        });

        this.mainControls = new Component({ tag: 'div', className: 'controls_block' });
        this.raceButton = new Button({
            style: 'green',
            text: 'RACE',
            onClick: () => {
                console.log('Race click');
            },
        });
        this.resetButton = new Button({
            style: 'green',
            text: 'RESET',
            onClick: () => {
                console.log('Reset click');
            },
        });
        this.generateCarsButton = new Button({
            style: 'blue',
            size: 'l',
            text: 'GENERATE CARS',
            onClick: GarageControls.generateCars.bind(this),
        });
        this.selectedCar = undefined;

        this.disableUpdateInput();
        this.setupSubscriptions();
        this.setupAttributes();
        this.build();
    }

    async createNewCar() {
        const carName = (this.createInput.getNode() as HTMLInputElement).value;
        const carColor = (this.createColorPicker.getNode() as HTMLInputElement).value;
        await fetch('http://localhost:3000/garage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: carName, color: carColor }),
        });
        appController.handleCreateCar();
    }

    handleSelectedCar(car: Car) {
        this.selectedCar = car;
        this.updateInput.removeAttribute('disabled');
        (this.updateInput.getNode() as HTMLInputElement).value = car.name;
        this.updateColorPicker.removeAttribute('disabled');
        (this.updateColorPicker.getNode() as HTMLInputElement).value = car.color;
        this.updateButton.removeAttribute('disabled');
    }

    async updateCar() {
        const carName = (this.updateInput.getNode() as HTMLInputElement).value;
        const carColor = (this.updateColorPicker.getNode() as HTMLInputElement).value;
        await fetch(`http://localhost:3000/garage/${this.selectedCar?.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: carName, color: carColor }),
        });
        appController.handleUpdateCar();
        this.disableUpdateInput();
    }

    disableUpdateInput() {
        this.updateInput.setAttribute('disabled', 'true');
        this.updateColorPicker.setAttribute('disabled', 'true');
        this.updateButton.setAttribute('disabled', 'true');
        (this.updateInput.getNode() as HTMLInputElement).value = '';
        (this.updateColorPicker.getNode() as HTMLInputElement).value = '#ffffff';
    }

    static getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    static async generateCars() {
        const generateRequests = new Array(carQuantityToGenerate).fill(undefined).map(() => {
            const carManufacturer = carManufacturers[GarageControls.getRandomInt(carManufacturers.length)];
            const carModel = carModels[GarageControls.getRandomInt(carModels.length)];
            const carColor = carColors[GarageControls.getRandomInt(carColors.length)];
            const requestBody = { name: `${carManufacturer} ${carModel}`, color: carColor };
            return fetch('http://localhost:3000/garage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
        });
        await Promise.all(generateRequests);
        appController.handleCreateCar();
    }

    setupSubscriptions() {
        appController.onSelectCar(this.handleSelectedCar.bind(this));
    }

    setupAttributes() {
        this.createColorPicker.setAttribute('type', 'color');
        (this.createColorPicker.getNode() as HTMLInputElement).value = '#ffffff';
        this.updateColorPicker.setAttribute('type', 'color');
        (this.updateColorPicker.getNode() as HTMLInputElement).value = '#ffffff';
    }

    build() {
        this.createBlock.appendChildren([this.createInput, this.createColorPicker, this.createButton]);
        this.updateBlock.appendChildren([this.updateInput, this.updateColorPicker, this.updateButton]);
        this.mainControls.appendChildren([this.raceButton, this.resetButton, this.generateCarsButton]);
        this.appendChildren([this.createBlock, this.updateBlock, this.mainControls]);
    }
}
