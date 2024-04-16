import PS from '../common/publishSubscribe';
import PublishSubscribeEvent from '../types/publishSubscribeEvents';

class LoginController {
    isLoggedin: boolean;

    firstNameKey: string = 'firstName';

    surNameKey: string = 'surname';

    constructor() {
        this.isLoggedin = Boolean(localStorage.getItem(this.firstNameKey) && localStorage.getItem(this.surNameKey));
        this.setupSubscribtion();
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.Login, this.saveUserData.bind(this));
        PS.subscribe(PublishSubscribeEvent.Logout, LoginController.detateUserData);
    }

    saveUserData({ name, surname }: { name: string; surname: string }) {
        localStorage.setItem(this.firstNameKey, name);
        localStorage.setItem(this.surNameKey, surname);
    }

    static detateUserData() {
        localStorage.clear();
    }
}

export default new LoginController();
