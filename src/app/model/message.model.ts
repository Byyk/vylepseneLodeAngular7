import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class MessageModel {
    uid: string;
    MatchUid: string;
    message: string;
    senderUid: string;
    timestapm: Timestamp;
    type: string;
}
