import './spinner.css';
import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import { PublishSubscribeEvent } from '../../../types/types';

export default class Spinner extends Component {
    constructor() {
        super({ tag: 'div', className: 'loading' });

        this.setupSubscribtion();
        // // this.setupListeners();
        // this.setupState();
        // this.build();
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.WSConnect, this.hideSpinner.bind(this));
        PS.subscribe(PublishSubscribeEvent.WSDisconnect, this.showSpinner.bind(this));
    }

    hideSpinner() {
        this.addClass('loading--hidden');
    }

    showSpinner() {
        this.removeClass('loading--hidden');
    }
}
