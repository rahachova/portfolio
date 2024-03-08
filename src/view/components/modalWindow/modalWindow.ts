import './modalWindow.css';
import Component from '../../common/component';

export default class ModalWindow extends Component {
    header: Component;

    form: Component;

    nameInput: Component;

    nameInputLabel: Component;

    nameInputId: string = 'nameInput';

    surnameInput: Component;

    surnameInputLabel: Component;

    surnameInputId: string = 'surnameId';

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
        this.surnameInput = new Component({ tag: 'input' });
        this.surnameInputLabel = new Component({
            tag: 'label',
            text: 'Surname:',
        });
        this.formButton = new Component({
            tag: 'button',
            className: 'modal_button',
            text: 'Login',
        });

        this.setupElements();
        this.setupListeners();
        this.build();
    }

    setupElements() {
        this.nameInput.setAttribute('type', 'text');
        this.nameInput.setAttribute('id', this.nameInputId);
        this.nameInput.setAttribute('required', '');
        this.nameInputLabel.setAttribute('for', this.nameInputId);
        this.surnameInput.setAttribute('type', 'text');
        this.surnameInput.setAttribute('required', '');
        this.surnameInputLabel.setAttribute('for', this.surnameInputId);
        this.formButton.setAttribute('type', 'submit');
    }

    setupListeners() {
        this.form.addListener('submit', (event: Event) => {
            event.preventDefault();
        });
    }

    build() {
        this.form.appendChildren([
            this.nameInputLabel,
            this.nameInput,
            this.surnameInputLabel,
            this.surnameInput,
            this.formButton,
        ]);
        this.appendChildren([this.header, this.form]);
    }
}
