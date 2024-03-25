import { Car, Winner } from '../types/types';

class AppController {
    currentWinner: string | undefined = undefined;

    garageNavigateSubscriptions: Array<() => void> = [];

    winnersNavigateSubscriptions: Array<() => void> = [];

    createCarSubscriptions: Array<() => void> = [];

    deleteCarSubscriptions: Array<() => void> = [];

    selectCarSubscriptions: Array<(car: Car) => void> = [];

    updateCarSubscriptions: Array<() => void> = [];

    startRaceSubscriptions: Array<() => void> = [];

    resetRaceSubscriptions: Array<() => void> = [];

    pageChangeSubscriptions: Array<() => void> = [];

    winSubscriptions: Array<(message: string | undefined) => void> = [];

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

    onStartRace(subscribtion: () => void) {
        this.startRaceSubscriptions.push(subscribtion);
    }

    onResetRace(subscribtion: () => void) {
        this.resetRaceSubscriptions.push(subscribtion);
    }

    onPageChange(subscribtion: () => void) {
        this.pageChangeSubscriptions.push(subscribtion);
    }

    onRaceWin(subscribtion: (message: string | undefined) => void) {
        this.winSubscriptions.push(subscribtion);
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

    handleStartRace() {
        this.currentWinner = undefined;
        this.startRaceSubscriptions.forEach((subscribtion) => subscribtion());
    }

    handleResetRace() {
        this.resetRaceSubscriptions.forEach((subscribtion) => subscribtion());
    }

    handlePageChange() {
        this.pageChangeSubscriptions.forEach((subscribtion) => subscribtion());
    }

    async handleFinish(name: string, id: number, time: number) {
        if (!this.currentWinner) {
            this.currentWinner = `${name} went first! (${time}s)`;
            this.winSubscriptions.forEach((subscribtion) => subscribtion(this.currentWinner));

            const response = await fetch(`http://127.0.0.1:3000/winners/${id}`);

            if (response.ok) {
                const savedWinner = await response.json();
                await AppController.updateWinner({ wins: savedWinner.wins + 1, time }, id);
            } else {
                await AppController.createWinner({ id, wins: 1, time });
            }
        }
    }

    static async updateWinner(winner: Winner, id: number) {
        await fetch(`http://127.0.0.1:3000/winners/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(winner),
        });
    }

    static async createWinner(winner: Winner) {
        await fetch(`http://127.0.0.1:3000/winners`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(winner),
        });
    }
}

export default new AppController();
