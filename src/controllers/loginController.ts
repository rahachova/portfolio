class LoginController {
    logoutSubscribtions: Array<() => void> = [];

    loginSubscribtions: Array<() => void> = [];

    isLoggedin: boolean;

    firstNameKey: string = 'firstName';

    surNameKey: string = 'surname';

    constructor() {
        this.isLoggedin = Boolean(localStorage.getItem(this.firstNameKey) && localStorage.getItem(this.surNameKey));
    }

    onLogout(subscribtion: () => void) {
        this.logoutSubscribtions.push(subscribtion);
    }

    onLogin(subscribtion: () => void) {
        this.loginSubscribtions.push(subscribtion);
    }

    handleLogin(firstName: string, surname: string) {
        this.saveUserData(firstName, surname);
        this.loginSubscribtions.forEach((subscribtion) => subscribtion());
    }

    handleLogout() {
        this.detateUserData();
        this.logoutSubscribtions.forEach((subscribtion) => subscribtion());
    }

    saveUserData(firstName: string, surname: string) {
        localStorage.setItem(this.firstNameKey, firstName);
        localStorage.setItem(this.surNameKey, surname);
    }

    detateUserData() {
        localStorage.removeItem(this.firstNameKey);
        localStorage.removeItem(this.surNameKey);
    }

    getFullName() {
        return `${localStorage.getItem(this.firstNameKey)} ${localStorage.getItem(this.surNameKey)}`;
    }
}

export default new LoginController();
