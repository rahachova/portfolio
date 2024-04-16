import './spinner.css';
import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import PublishSubscribeEvent from '../../../types/publishSubscribeEvents';

export default class Spinner extends Component {
    constructor() {
        super({ tag: 'div', className: 'loading' });

        this.setupSubscribtion();
        // // this.setupListeners();
        // this.setupState();
        // this.build();
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.Connect, this.hideSpinner.bind(this));
        PS.subscribe(PublishSubscribeEvent.Disconnect, this.showSpinner.bind(this));
    }

    hideSpinner() {
        this.addClass('loading--hidden');
    }

    showSpinner() {
        this.removeClass('loading--hidden');
    }
}
