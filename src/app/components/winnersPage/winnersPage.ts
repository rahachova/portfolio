import './winnersPage.css';
import Component from '../../common/component';
import Button from '../../common/button/button';
import { FullWinner, Order, Sorting, Winner } from '../../types/types';
import appController from '../../controllers/appController';

export default class WinnersPage extends Component {
    winnersHeader: Component;

    winnersPageNumber: Component;

    winnersTable: Component;

    winnersTableHeader: Component;

    winnersTableNumber: Component;

    winnersTableCar: Component;

    winnersTableName: Component;

    winnersTableWins: Component;

    winnersTableBestTime: Component;

    pagination: Component;

    prevButton: Button;

    nextButton: Button;

    currentPage: number = 1;

    winnersPerPage: number = 10;

    totalPages: number = 0;

    sorting: Sorting = 'time';

    order: Order = 'DESC';

    constructor() {
        super({ tag: 'div', className: 'winners-page winners-page--hidden', text: '' });
        this.winnersHeader = new Component({ tag: 'h2', text: 'Winners', className: 'winners_header' });
        this.winnersPageNumber = new Component({ tag: 'h2', text: `Page #${this.currentPage}`, className: 'winners_page-number' });
        this.winnersTable = new Component({ tag: 'table' });
        this.winnersTableHeader = new Component({ tag: 'tr', className: 'winners_table-header' });
        this.winnersTableNumber = new Component({ tag: 'th', text: 'Number', className: 'winners_table-header--active' });
        this.winnersTableCar = new Component({ tag: 'th', text: 'Car' });
        this.winnersTableName = new Component({ tag: 'th', text: 'Name' });
        this.winnersTableWins = new Component({ tag: 'th', text: 'Wins', className: 'winners_table-header--active' });
        this.winnersTableBestTime = new Component({ tag: 'th', text: 'Best time', className: 'winners_table-header--active' });
        this.pagination = new Component({ tag: 'div', className: 'pagination' });
        this.prevButton = new Button({
            style: 'green',
            text: 'PREV',
            onClick: () => {
                this.currentPage -= 1;
                this.renderWinnersTable();
            },
        });
        this.nextButton = new Button({
            style: 'green',
            text: 'NEXT',
            onClick: () => {
                this.currentPage += 1;
                this.renderWinnersTable();
            },
        });

        this.setupSubscriptions();
        this.setupListeners();
        this.build();
        this.init();
    }

    async init() {
        await this.renderWinnersPage();
        await this.renderWinnersTable();
    }

    async renderWinnersPage() {
        const response = await fetch('http://127.0.0.1:3000/winners');
        const winners = await response.json();
        const totalWinners = winners.length;
        this.totalPages = Math.ceil(totalWinners / this.winnersPerPage);
        this.winnersHeader.setTextContent(`Winners (${totalWinners})`);
    }

    async renderWinnersTable() {
        const response = await fetch(
            `http://127.0.0.1:3000/winners?_limit=${this.winnersPerPage}&_page=${this.currentPage}&_sort=${this.sorting}&_order=${this.order}`
        );
        const winners: Winner[] = await response.json();
        const fullWinnersData = await Promise.all(winners.map(WinnersPage.getCar));
        const winnersRow = fullWinnersData.map(WinnersPage.buildTableRow);
        this.winnersTable.removeChild(this.winnersTableHeader);
        this.winnersTable.destroyChildren();
        this.winnersTable.appendChildren([this.winnersTableHeader, ...winnersRow]);

        // const carTracks = cars.map((car: Car) => new CarTrack(car));
        // this.carTracks.destroyChildren();
        // this.carTracks.appendChildren(carTracks);
        if (this.currentPage === 1) {
            this.prevButton.setAttribute('disabled', 'true');
        } else {
            this.prevButton.removeAttribute('disabled');
        }
        if (this.currentPage >= this.totalPages) {
            this.nextButton.setAttribute('disabled', 'true');
        } else {
            this.nextButton.removeAttribute('disabled');
        }
        this.winnersPageNumber.setTextContent(`Page #${this.currentPage}`);
    }

    static async getCar(winner: Winner) {
        const response = await fetch(`http://127.0.0.1:3000/garage/${winner.id}`);
        const car = await response.json();
        return { ...car, ...winner };
    }

    handleIdSort() {
        if (this.sorting === 'id') {
            this.handleOrder();
        } else {
            this.sorting = 'id';
        }
        this.renderWinnersTable();
    }

    handleWinsSort() {
        if (this.sorting === 'wins') {
            this.handleOrder();
        } else {
            this.sorting = 'wins';
        }
        this.renderWinnersTable();
    }

    handleTimeSort() {
        if (this.sorting === 'time') {
            this.handleOrder();
        } else {
            this.sorting = 'time';
        }
        this.renderWinnersTable();
    }

    handleOrder() {
        if (this.order === 'ASC') {
            this.order = 'DESC';
        } else {
            this.order = 'ASC';
        }
    }

    hide() {
        this.addClass('winners-page--hidden');
    }

    show() {
        this.removeClass('winners-page--hidden');
    }

    static buildTableRow(winner: FullWinner) {
        const row = new Component({ tag: 'tr', className: 'winners_table-row' });
        const number = new Component({ tag: 'td', text: String(winner.id) });
        const car = new Component({ tag: 'td', className: 'winners_car' });
        car.setAttribute('style', `background-color: ${winner.color};`);
        const name = new Component({ tag: 'td', text: winner.name });
        const wins = new Component({ tag: 'td', text: String(winner.wins) });
        const bestTime = new Component({ tag: 'td', text: String(winner.time) });
        row.appendChildren([number, car, name, wins, bestTime]);
        return row;
    }

    setupListeners() {
        this.winnersTableNumber.addListener('click', this.handleIdSort.bind(this));
        this.winnersTableWins.addListener('click', this.handleWinsSort.bind(this));
        this.winnersTableBestTime.addListener('click', this.handleTimeSort.bind(this));
    }

    setupSubscriptions() {
        appController.onWinnersNavigate(this.init.bind(this));
    }

    build() {
        this.winnersTableHeader.appendChildren([
            this.winnersTableNumber,
            this.winnersTableCar,
            this.winnersTableName,
            this.winnersTableWins,
            this.winnersTableBestTime,
        ]);
        this.winnersTable.append(this.winnersTableHeader);
        this.pagination.appendChildren([this.prevButton, this.nextButton]);
        this.appendChildren([this.winnersHeader, this.winnersPageNumber, this.winnersTable, this.pagination]);
    }
}
