import './button.css';
import Component from '../component';

type ButtonConfig = { text: string; style: 'green' | 'blue'; size?: 'l'; onClick: (event: Event) => void };

export default class Button extends Component {
    constructor(config: ButtonConfig) {
        const { text, style, size, onClick } = config;
        super({ tag: 'button', className: `button button--${style} button--${size || 'm'}`, text });
        this.addListener('click', onClick);
    }
}
