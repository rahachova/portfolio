import './card.css';
import Component from '../../common/component';

export default class Card extends Component {
    private isUsedValue: boolean = false;

    private cardIndexValue: number = 0;

    constructor(word: string, cardIndexValue: number) {
        super({ tag: 'div', className: 'card', text: word });
        this.cardIndexValue = cardIndexValue;
    }

    setIsUsed(value: boolean) {
        this.isUsedValue = value;
    }

    get isUsed(): boolean {
        return this.isUsedValue;
    }

    get cardIndex(): number {
        return this.cardIndexValue;
    }
}
