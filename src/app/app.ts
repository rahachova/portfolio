import View from '../view/view';

export default class App {
    view: View;

    constructor() {
        this.view = new View();
    }

    start() {
        this.view.init();
    }
}
