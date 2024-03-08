export default class LocalStorageController {
    static saveUserData(firstName: string, surname: string) {
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('surname', surname);
    }
}

