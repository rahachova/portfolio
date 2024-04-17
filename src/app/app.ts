import View from './view/view';
import './app.css';
import './controllers/webSocket';
import './controllers/loginController';

export default class App {
    view: View;

    constructor() {
        this.view = new View();
    }

    start() {
        this.view.init();
    }
}
