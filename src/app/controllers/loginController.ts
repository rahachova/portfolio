import PS from '../common/publishSubscribe';
import PublishSubscribeEvent from '../types/publishSubscribeEvents';

class LoginController {
    isLoggedin: boolean;

    nameKey: string = 'name';

    passwordKey: string = 'password';

    constructor() {
        this.isLoggedin = Boolean(localStorage.getItem(this.nameKey) && localStorage.getItem(this.passwordKey));
        this.setupSubscribtion();
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.Login, this.saveUserData.bind(this));
        PS.subscribe(PublishSubscribeEvent.Logout, LoginController.detateUserData);
    }

    saveUserData({ name, password }: { name: string; password: string }) {
        localStorage.setItem(this.nameKey, name);
        localStorage.setItem(this.passwordKey, password);
    }

    static detateUserData() {
        localStorage.clear();
    }
}

export default new LoginController();
