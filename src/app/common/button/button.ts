import './button.css';
import Component from '../component';

type ButtonConfig = { text: string; onClick: (event: Event) => void };

export default class Button extends Component {
    constructor(config: ButtonConfig) {
        const { text, onClick } = config;
        super({ tag: 'button', className: 'button', text });
        this.addListener('click', onClick);
    }
}
