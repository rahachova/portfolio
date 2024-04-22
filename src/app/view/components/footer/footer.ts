import Component from '../../../common/component';
import SchoolLogo from '../../../../assets/school.svg';
import './footer.css';

const CREATOR_GINHUB = 'https://github.com/rahachova';
const CREATION_YEAR = '2024';
const SCHOOL_NAME = 'RSSchool';

export default class Footer extends Component {
    schoolLogo: Component;

    creatorName: Component;

    year: Component;

    constructor() {
        super({ tag: 'div', className: 'footer' });

        this.schoolLogo = new Component({
            tag: 'img',
            className: 'footer_logo',
        });
        this.creatorName = new Component({
            tag: 'a',
            className: 'footer_link',
            text: 'Aliaksandra Rahachova',
        });
        this.year = new Component({
            tag: 'p',
            className: 'footer_item',
            text: `${SCHOOL_NAME} ${CREATION_YEAR}`,
        });

        this.setupAttribute();
        this.build();
    }

    setupAttribute() {
        this.creatorName.setAttribute('href', CREATOR_GINHUB);
        this.creatorName.setAttribute('target', '_blank');
        this.schoolLogo.setAttribute('src', SchoolLogo);
    }

    build() {
        this.appendChildren([this.schoolLogo, this.creatorName, this.year]);
    }
}
