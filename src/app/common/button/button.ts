import './button.css';
import Component from '../component';

export default class Button extends Component {
    constructor(config: { text: string; style: 'green' | 'blue' }) {
        const { text, style } = config;
        super({ tag: 'button', className: `button button--${style}`, text });
    }
}
