import './garage.css';
import Component from '../../common/component';
import CarTrack from '../carTrack/carTrack';
import Button from '../../common/button/button';
import { Car } from '../../types/types';
import appController from '../../controllers/appController';

export default class Garage extends Component {
    garageHeader: Component;

    garagePageNumber: Component;

    carTracks: Component;

    pagination: Component;

    prevButton: Button;

    nextButton: Button;

    currentPage: number = 1;

    carsPerPage: number = 7;

    totalPages: number = 0;

    constructor() {
        super({ tag: 'div', className: 'garage', text: '' });
        this.garageHeader = new Component({ tag: 'h2', text: 'Garage', className: 'garage_header' });
        this.garagePageNumber = new Component({ tag: 'h2', text: `Page #${this.currentPage}`, className: 'garage_page-number' });
        this.carTracks = new Component({ tag: 'div', className: 'car-tracks' });
        this.pagination = new Component({ tag: 'div', className: 'pagination' });
        this.prevButton = new Button({
            style: 'green',
            text: 'PREV',
            onClick: () => {},
        });
        this.nextButton = new Button({
            style: 'green',
            text: 'NEXT',
            onClick: () => {
                this.currentPage += 1;
                this.renderCarTracks();
            },
        });

        this.setupSubscriptions();
        this.build();
        this.init();
    }

    async init() {
        this.renderGarage();
        this.renderCarTracks();
    }

    async renderGarage() {
        const response = await fetch('http://127.0.0.1:3000/garage');
        const cars = await response.json();
        const totalCars = cars.length;
        this.totalPages = Math.ceil(totalCars / this.carsPerPage);
        this.garageHeader.setTextContent(`Garage (${cars.length})`);
    }

    async renderCarTracks() {
        const response = await fetch(`http://127.0.0.1:3000/garage?_limit=${this.carsPerPage}&_page=${this.currentPage}`);
        const cars = await response.json();
        const carTracks = cars.map((car: Car) => new CarTrack(car));
        this.carTracks.destroyChildren();
        this.carTracks.appendChildren(carTracks);
        if (this.currentPage === 1) {
            this.prevButton.setAttribute('disabled', 'true');
        } else {
            this.prevButton.removeAttribute('disabled');
        }
        if (this.currentPage === this.totalPages) {
            this.nextButton.setAttribute('disabled', 'true');
        } else {
            this.nextButton.removeAttribute('disabled');
        }
        this.garagePageNumber.setTextContent(`Page #${this.currentPage}`);
    }

    setupSubscriptions() {
        appController.onCreateCar(this.init.bind(this));
    }

    build() {
        this.pagination.appendChildren([this.prevButton, this.nextButton]);
        this.appendChildren([this.garageHeader, this.garagePageNumber, this.carTracks, this.pagination]);
    }
}
