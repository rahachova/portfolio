import PS from '../common/publishSubscribe';
import { PublishSubscribeEvent, WSMessage, WSMessageType } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

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
        PS.subscribe(PublishSubscribeEvent.Logout, this.logoutUser.bind(this));
        PS.subscribe(PublishSubscribeEvent.WSMessageReceived, this.listenSocket.bind(this));
        PS.subscribe(PublishSubscribeEvent.WSConnect, this.checkUserLogin.bind(this));
    }

    loginUser({ name, password }: { name: string; password: string }) {
        localStorage.setItem(this.nameKey, name);
        localStorage.setItem(this.passwordKey, password);

        const loginObject = {
            id: uuidv4(),
            type: WSMessageType.USER_LOGIN,
            payload: {
                user: {
                    login: name,
                    password: password,
                },
            },
        };
        PS.sendEvent(PublishSubscribeEvent.WSMessage, loginObject);
    }

    logoutUser() {
        const name = localStorage.getItem(this.nameKey);
        const password = localStorage.getItem(this.passwordKey);
        const logoutObject = {
            id: uuidv4(),
            type: WSMessageType.USER_LOGOUT,
            payload: {
                user: {
                    login: name,
                    password: password,
                },
            },
        };
        PS.sendEvent(PublishSubscribeEvent.WSMessage, logoutObject);
        LoginController.detateUserData();
    }

    listenSocket(data: WSMessage) {
        if (data.type === WSMessageType.USER_LOGIN) {
            PS.sendEvent(PublishSubscribeEvent.Loggedin);
        } else if (data.type === WSMessageType.USER_LOGOUT) {
            PS.sendEvent(PublishSubscribeEvent.Loggedout);
        }
    }

    static detateUserData() {
        localStorage.clear();
    }
}

export default new LoginController();
