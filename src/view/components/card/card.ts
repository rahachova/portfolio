import './card.css';
import Component from '../../common/component';

export default class Card extends Component {
    private isUsedValue: boolean = false;

    constructor(word: string) {
        super({ tag: 'div', className: 'card', text: word });
    }

    setIsUsed(value: boolean) {
        this.isUsedValue = value;
    }

    get isUsed(): boolean {
        return this.isUsedValue;
    }
}
