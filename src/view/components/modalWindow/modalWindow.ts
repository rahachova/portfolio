import './modalWindow.css';
import Component from '../../common/component';
import loginController from '../../../controllers/loginController';

const NAME_REGEX = '[A-Z][\\-a-z]+';
export default class ModalWindow extends Component {
    header: Component;

    form: Component;

    nameInput: Component;

    nameInputLabel: Component;

    nameInputId: string = 'nameInput';

    nameInputName: string = 'name';

    nameError: Component;

    surnameError: Component;

    surnameInput: Component;

    surnameInputLabel: Component;

    surnameInputId: string = 'surnameId';

    surnameInputName: string = 'surname';

    formButton: Component;

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
        this.surnameInput = new Component({ tag: 'input' });
        this.surnameInputLabel = new Component({
            tag: 'label',
            text: 'Surname:',
        });
        this.surnameError = new Component({
            tag: 'span',
            className: 'modal_error',
        });
        this.formButton = new Component({
            tag: 'button',
            className: 'button',
            text: 'Login',
        });

        this.setupElements();
        this.setupListeners();
        this.setupSubscribtion();
        this.setupForm();
        this.setupState();
        this.build();
    }

    setupElements() {
        this.nameInput.setAttribute('type', 'text');
        this.nameInput.setAttribute('id', this.nameInputId);

        this.nameInputLabel.setAttribute('for', this.nameInputId);
        this.surnameInput.setAttribute('type', 'text');

        this.surnameInputLabel.setAttribute('for', this.surnameInputId);
        this.formButton.setAttribute('type', 'submit');
    }

    setupState() {
        if (loginController.isLoggedin) {
            this.hideModalWindow();
        }
    }

    setupForm() {
        this.form.setAttribute('novalidate', '');
        this.nameInput.setAttribute('required', '');
        this.nameInput.setAttribute('minlength', '3');
        this.nameInput.setAttribute('pattern', NAME_REGEX);
        this.nameInput.setAttribute('name', this.nameInputName);
        this.surnameInput.setAttribute('required', '');
        this.surnameInput.setAttribute('minlength', '4');
        this.surnameInput.setAttribute('pattern', NAME_REGEX);
        this.surnameInput.setAttribute('name', this.surnameInputName);
    }

    setupSubscribtion() {
        loginController.onLogout(this.showModalWindow.bind(this));
    }

    setupListeners() {
        this.form.addListener('submit', this.handleFormSubmit.bind(this));
        this.nameInput.addListener('input', () =>
            ModalWindow.hideInputError(this.nameError)
        );
        this.surnameInput.addListener('input', () =>
            ModalWindow.hideInputError(this.surnameError)
        );
    }

    handleFormSubmit(event: Event) {
        event.preventDefault();
        const nameErrorText = ModalWindow.validateInput(this.nameInputElement);
        const surnameErrorText = ModalWindow.validateInput(
            this.surnameInputElement
        );

        if (nameErrorText) {
            ModalWindow.showInputError(nameErrorText, this.nameError);
        }
        if (surnameErrorText) {
            ModalWindow.showInputError(surnameErrorText, this.surnameError);
        }

        const formData = new FormData(event.target as HTMLFormElement);

        this.hideModalWindow();
        loginController.handleLogin(
            formData.get(this.nameInputName) as string,
            formData.get(this.surnameInputName) as string
        );
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

    static validateInput(input: HTMLInputElement): string {
        if (input.validity.tooShort) {
            return 'The field value is too short.';
        }
        if (input.validity.patternMismatch) {
            return 'The field only accepts English alphabet letters and the hyphen symbol. The first letter has to be in uppercase.';
        }
        if (input.validity.valueMissing) {
            return 'Please enter value.';
        }
        return '';
    }

    build() {
        this.form.appendChildren([
            this.nameInputLabel,
            this.nameError,
            this.nameInput,
            this.surnameInputLabel,
            this.surnameError,
            this.surnameInput,
            this.formButton,
        ]);
        this.appendChildren([this.header, this.form]);
    }

    get nameInputElement(): HTMLInputElement {
        return this.nameInput.getNode() as HTMLInputElement;
    }

    get surnameInputElement(): HTMLInputElement {
        return this.surnameInput.getNode() as HTMLInputElement;
    }
}
