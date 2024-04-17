import PS from '../common/publishSubscribe';
import { PublishSubscribeEvent, WSMessage, WSMessageType } from '../types/types';

class LoginController {
    nameKey: string = 'name';

    passwordKey: string = 'password';

    constructor() {
        this.setupSubscribtion();
    }

    checkUserLogin() {
        const name = localStorage.getItem(this.nameKey);
        const password = localStorage.getItem(this.passwordKey);

        if (name && password) {
            const loginData = { name, password };
            this.loginUser(loginData);
        }
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.Login, this.loginUser.bind(this));
        PS.subscribe(PublishSubscribeEvent.Logout, LoginController.detateUserData);
        PS.subscribe(PublishSubscribeEvent.WSMessageReceived, this.listenSocket.bind(this));
        PS.subscribe(PublishSubscribeEvent.WSConnect, this.checkUserLogin.bind(this));
    }

    loginUser({ name, password }: { name: string; password: string }) {
        localStorage.setItem(this.nameKey, name);
        localStorage.setItem(this.passwordKey, password);

        const loginObject = {
            id: '123241',
            type: 'USER_LOGIN',
            payload: {
                user: {
                    login: name,
                    password: password,
                },
            },
        };
        PS.sendEvent(PublishSubscribeEvent.WSMessage, {
            message: JSON.stringify(loginObject),
        });
    }

    listenSocket(data: WSMessage) {
        if (data.type === WSMessageType.USER_LOGIN) {
            PS.sendEvent(PublishSubscribeEvent.Loggedin);
        }
    }

    static detateUserData() {
        localStorage.clear();
    }
}

export default new LoginController();
