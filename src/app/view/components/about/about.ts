import Button from '../../../common/button/button';
import Component from '../../../common/component';
import { PublishSubscribeEvent } from '../../../types/types';
import PS from '../../../common/publishSubscribe';
import './about.css';

const CREATOR_GINHUB = 'https://github.com/rahachova';

export default class About extends Component {
    gameName: Component;

    gameDescription: Component;

    creatorName: Component;

    buttonBack: Component;

    isLoggedin: boolean = false;

    constructor() {
        super({ tag: 'div', className: 'about' });

        this.gameName = new Component({
            tag: 'h2',
            className: 'game_name',
            text: 'Fun chat',
        });
        this.gameDescription = new Component({
            tag: 'p',
            className: 'game_description',
            text: 'The application is designed to demonstrate the Fun Chat task as part of the RSSchool JS/FE 2023Q3 course. Experience seamless communication with my chat application, connecting you instantly with friends, family, and colleagues across the globe.',
        });
        this.creatorName = new Component({
            tag: 'a',
            className: 'footer_link',
            text: 'Aliaksandra Rahachova',
        });
        this.buttonBack = new Button({ text: 'Click to go back', onClick: this.handleHideAbout.bind(this) });

        this.setupAttribute();
        this.setupSubscribtion();
        this.build();
    }

    handleHideAbout(event: Event) {
        event.preventDefault();
        PS.sendEvent(PublishSubscribeEvent.AboutHidden, { isLoggedin: this.isLoggedin });
        this.hideAbout();
    }

    showAbout(payload: { isLoggedin: boolean }) {
        this.isLoggedin = payload.isLoggedin;
        this.addClass('about--shown');
    }

    hideAbout() {
        this.removeClass('about--shown');
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.AboutShown, this.showAbout.bind(this));
    }

    setupAttribute() {
        this.creatorName.setAttribute('href', CREATOR_GINHUB);
    }

    build() {
        this.appendChildren([this.gameName, this.gameDescription, this.creatorName, this.buttonBack]);
    }
}
