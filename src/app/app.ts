import View from './view/view';
import './app.css';
import './controllers/webSocket';

export default class App {
    view: View;

    constructor() {
        this.view = new View();
    }

    start() {
        this.view.init();
    }
}
