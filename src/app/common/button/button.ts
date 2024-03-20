import './button.css';
import Component from '../component';

type ButtonConfig = { text: string; style: 'green' | 'blue'; onClick: (event: Event) => void };

export default class Button extends Component {
    constructor(config: ButtonConfig) {
        const { text, style, onClick } = config;
        super({ tag: 'button', className: `button button--${style}`, text });
        this.addListener('click', onClick)
    }
}
