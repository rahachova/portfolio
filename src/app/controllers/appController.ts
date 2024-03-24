import { Car } from '../types/types';

class AppController {
    garageNavigateSubscriptions: Array<() => void> = [];

    winnersNavigateSubscriptions: Array<() => void> = [];

    createCarSubscriptions: Array<() => void> = [];

    deleteCarSubscriptions: Array<() => void> = [];

    selectCarSubscriptions: Array<(car: Car) => void> = [];

    updateCarSubscriptions: Array<() => void> = [];

    onGarageNavigate(subscribtion: () => void) {
        this.garageNavigateSubscriptions.push(subscribtion);
    }

    onWinnersNavigate(subscribtion: () => void) {
        this.winnersNavigateSubscriptions.push(subscribtion);
    }

    onCreateCar(subscribtion: () => void) {
        this.createCarSubscriptions.push(subscribtion);
    }

    onDeleteCar(subscribtion: () => void) {
        this.deleteCarSubscriptions.push(subscribtion);
    }

    onSelectCar(subscribtion: (car: Car) => void) {
        this.selectCarSubscriptions.push(subscribtion);
    }

    onUpdateCar(subscribtion: () => void) {
        this.updateCarSubscriptions.push(subscribtion);
    }

    handleGarageNavigate() {
        this.garageNavigateSubscriptions.forEach((subscribtion) => subscribtion());
    }

    handleWinnersNavigate() {
        this.winnersNavigateSubscriptions.forEach((subscribtion) => subscribtion());
    }

    handleCreateCar() {
        this.createCarSubscriptions.forEach((subscribtion) => subscribtion());
    }

    handleDeleteCar() {
        this.deleteCarSubscriptions.forEach((subscribtion) => subscribtion());
    }

    handleSelectCar(car: Car) {
        this.selectCarSubscriptions.forEach((subscribtion) => subscribtion(car));
    }

    handleUpdateCar() {
        this.updateCarSubscriptions.forEach((subscribtion) => subscribtion());
    }
}

export default new AppController();
