import './resultBlock.css';
import Component from '../../common/component';
import Card from '../card/card';

export default class ResultBlock extends Component {
    constructor() {
        super({
            tag: 'div',
            className: 'result-block',
        });
    }

    checkIsCorrect(): boolean {
        const cardToCheck = this.getChildren();
        cardToCheck.forEach((card, index) => {
            if ((card as Card).cardIndex === index) {
                card.addClass('card--correct');
                card.removeClass('card--incorrect');
            } else {
                card.addClass('card--incorrect');
                card.removeClass('card--correct');
            }
        });
        return cardToCheck.every((card, index) => (card as Card).cardIndex === index);
    }

    disableInactiveCards() {
        this.getChildren().forEach((card) => {
            (card as Card).setIsInactive();
            card.addClass('card--inactive');
        });
    }

    setCorrectOrder() {
        const sortedCards = [...(this.getChildren() as Card[]).sort((a: Card, b: Card) => a.cardIndex - b.cardIndex)];
        this.destroyChildren();
        this.appendChildren(sortedCards);
    }
}
