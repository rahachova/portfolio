import View from './view/view';
import './app.css';

export default class App {
    view: View;

    constructor() {
        this.view = new View();
    }

    start() {
        this.view.init();
    }
}
