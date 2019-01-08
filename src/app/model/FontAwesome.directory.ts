import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import {faCrosshairs, faDiceFive, faPlus, faTimes} from '@fortawesome/free-solid-svg-icons';
export class FontAwesomeDirectory {
    public static data: IconDefinitions = {
        "faCrosshairs" : faCrosshairs,
        "faTimes": faTimes,
        "faPlus": faPlus,
        "faDiceFive": faDiceFive
    };
}

export interface IconDefinitions {
    [key: string]: IconDefinition;
}
