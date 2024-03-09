class LoginController {
    logoutSubscribtions: Array<() => void> = [];

    loginSubscribtions: Array<() => void> = [];

    isLoggedin: boolean;

    constructor() {
        this.isLoggedin = Boolean(
            localStorage.getItem('firstName') && localStorage.getItem('surname')
        );
    }

    onLogout(subscribtion: () => void) {
        this.logoutSubscribtions.push(subscribtion);
    }

    onLogin(subscribtion: () => void) {
        this.loginSubscribtions.push(subscribtion);
    }

    handleLogin(firstName: string, surname: string) {
        LoginController.saveUserData(firstName, surname);
        this.loginSubscribtions.forEach((subscribtion) => subscribtion());
    }

    handleLogout() {
        LoginController.detateUserData();
        this.logoutSubscribtions.forEach((subscribtion) => subscribtion());
    }

    static saveUserData(firstName: string, surname: string) {
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('surname', surname);
    }

    static detateUserData() {
        localStorage.removeItem('firstName');
        localStorage.removeItem('surname');
    }
}

export default new LoginController();
