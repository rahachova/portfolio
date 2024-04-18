import './modalWindow.css';
import Component from '../../../common/component';
import loginController from '../../../controllers/loginController';
import PS from '../../../common/publishSubscribe';
import { PublishSubscribeEvent } from '../../../types/types';

const NAME_REGEX = '[A-Z][\\-a-z]+';
const PASSWORD_REGEX = '^\\d+$';
export default class ModalWindow extends Component {
    header: Component;

    form: Component;

    nameInput: Component;

    nameInputLabel: Component;

    nameInputId: string = 'nameInput';

    nameInputName: string = 'name';

    nameError: Component;

    passwordError: Component;

    passwordInput: Component;

    passwordInputLabel: Component;

    passwordInputId: string = 'passwordId';

    passwordInputName: string = 'password';

    buttons: Component;

    formButton: Component;

    aboutButton: Component;

    constructor() {
        super({ tag: 'div', className: 'modal' });

        this.header = new Component({
            tag: 'h2',
            className: 'modal_header',
            text: 'Sign in',
        });
        this.form = new Component({ tag: 'form', className: 'modal_form' });
        this.nameInput = new Component({ tag: 'input' });
        this.nameInputLabel = new Component({
            tag: 'label',
            text: 'First Name:',
        });
        this.nameError = new Component({
            tag: 'span',
            className: 'modal_error',
        });
        this.passwordInput = new Component({ tag: 'input' });
        this.passwordInputLabel = new Component({
            tag: 'label',
            text: 'Password:',
        });
        this.passwordError = new Component({
            tag: 'span',
            className: 'modal_error',
        });
        this.buttons = new Component({
            tag: 'div',
            className: 'buttons',
        });
        this.formButton = new Component({
            tag: 'button',
            className: 'button',
            text: 'Login',
        });

        this.aboutButton = new Component({
            tag: 'button',
            className: 'button',
            text: 'About',
        });

        this.setupElements();
        this.setupListeners();
        this.setupSubscribtion();
        this.setupForm();
        this.build();
    }

    setupElements() {
        this.nameInput.setAttribute('type', 'text');
        this.nameInput.setAttribute('id', this.nameInputId);

        this.nameInputLabel.setAttribute('for', this.nameInputId);
        this.passwordInput.setAttribute('type', 'text');

        this.passwordInputLabel.setAttribute('for', this.passwordInputId);
        this.formButton.setAttribute('type', 'submit');
    }

    setupForm() {
        this.form.setAttribute('novalidate', '');
        this.nameInput.setAttribute('required', '');
        this.nameInput.setAttribute('minlength', '3');
        this.nameInput.setAttribute('pattern', NAME_REGEX);
        this.nameInput.setAttribute('name', this.nameInputName);
        this.passwordInput.setAttribute('type', 'password');
        this.passwordInput.setAttribute('required', '');
        this.passwordInput.setAttribute('minlength', '7');
        this.passwordInput.setAttribute('pattern', PASSWORD_REGEX);
        this.passwordInput.setAttribute('name', this.passwordInputName);
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.Loggedout, this.showModalWindow.bind(this));
        PS.subscribe(PublishSubscribeEvent.Loggedin, this.hideModalWindow.bind(this));
    }

    setupListeners() {
        this.form.addListener('submit', this.handleFormSubmit.bind(this));
        this.nameInput.addListener('input', () => ModalWindow.hideInputError(this.nameError));
        this.passwordInput.addListener('input', () => ModalWindow.hideInputError(this.passwordError));
    }

    handleFormSubmit(event: Event) {
        event.preventDefault();
        const nameErrorText = ModalWindow.validateInputName(this.nameInputElement);
        const surnameErrorText = ModalWindow.validateInputPassword(this.surnameInputElement);

        if (nameErrorText) {
            ModalWindow.showInputError(nameErrorText, this.nameError);
            return;
        }
        if (surnameErrorText) {
            ModalWindow.showInputError(surnameErrorText, this.passwordError);
            return;
        }

        const formData = new FormData(event.target as HTMLFormElement);

        PS.sendEvent(PublishSubscribeEvent.Login, {
            name: formData.get(this.nameInputName) as string,
            password: formData.get(this.passwordInputName) as string,
        });
    }

    hideModalWindow() {
        this.addClass('modal--hidden');
    }

    showModalWindow() {
        this.removeClass('modal--hidden');
    }

    static hideInputError(errorComponent: Component) {
        errorComponent.removeClass('modal_error--shown');
        errorComponent.setTextContent('');
    }

    static showInputError(errorText: string, errorComponent: Component) {
        errorComponent.addClass('modal_error--shown');
        errorComponent.setTextContent(errorText);
    }

    static validateInputName(input: HTMLInputElement): string {
        if (input.validity.tooShort) {
            return 'The name should be a minimum of 3 characters in length.';
        }
        if (input.validity.patternMismatch) {
            return 'The name only accepts English alphabet letters and the hyphen symbol. The first letter has to be in uppercase.';
        }
        if (input.validity.valueMissing) {
            return 'Please enter value.';
        }
        return '';
    }

    static validateInputPassword(input: HTMLInputElement): string {
        if (input.validity.tooShort) {
            return 'The password should be a minimum of 7 characters in length.';
        }
        if (input.validity.patternMismatch) {
            return 'The field only accepts numbers.';
        }
        if (input.validity.valueMissing) {
            return 'Please enter value.';
        }
        return '';
    }

    build() {
        this.buttons.appendChildren([this.formButton, this.aboutButton]);
        this.form.appendChildren([
            this.nameInputLabel,
            this.nameError,
            this.nameInput,
            this.passwordInputLabel,
            this.passwordError,
            this.passwordInput,
            this.buttons,
        ]);
        this.appendChildren([this.header, this.form]);
    }

    get nameInputElement(): HTMLInputElement {
        return this.nameInput.getNode() as HTMLInputElement;
    }

    get surnameInputElement(): HTMLInputElement {
        return this.passwordInput.getNode() as HTMLInputElement;
    }
}
