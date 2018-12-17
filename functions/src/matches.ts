import * as express from 'express';
import * as cors from 'cors';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Match } from '../../src/app/model/match.model'
import { FcmService } from './deviceGroupMessaging/index'

FcmService.initializeApp({
    LegaciServerKey: 'AIzaSyBOzIchn3WbfsMntAwvtP_D_0VJEgGgwXY',
    SenderId: '121767449124'
})

export function Matches() {
    const app = express();
    app.use(cors({origin: true}));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.post('/joinGame/public', async (req, res) => {
        const idToken = req.body.token;
        const password = req.body.password;
        const matchUid = req.body.matchUid;
        try{
            const token = await admin.auth().verifyIdToken(idToken);
            const matchPrivateData = await admin.firestore().doc(`Matches_private_data/${matchUid}`).get()
            const matchDoc = admin.firestore().doc(`Matches/${matchUid}`);
            const matchData : Match = (await matchDoc.get()).data() as Match;

            console.log(matchData);

            if(matchData.groupType !== 'Veřejná') {
                res.status(418).send('dobrej pokus :)');
                return null;
            }

            if(matchPrivateData.data().password !== password) {
                res.status(401).send('špatné heslo!');
                return null;
            }

            if(matchData.oponentUid !== '') {
                res.status(410).send('k zápasu je již někdo připojen!');
                return null;
            }

            const nickName = (await admin.firestore().doc(`Users/${token.uid}`).get()).data().nickName
            await matchDoc.update({
                oponentUid: token.uid,
                opopenentsNickName: nickName
            });

            await admin.firestore().collection('Users').doc(token.uid).update({
                lastMatch: {creator: false, state: 0, lastMatchUid: matchUid }
            })

            await FcmService.Instance.sendMessageToDeviceGroup({
                to: matchData.messagingToken,
                notification: {
                    title: 'Hrač se připojil do tvé hry!',
                    body: `Hráč ${nickName} se připojil do tvé hry.`
                },
                data: {
                    type: 'player-joined'
                }
            })
            res.status(200).send();
        }
        catch(err)
        {
          console.log(err);
          res.status(404).send('neplatný token!')
        }
    });

    app.post('/joinGame/private/send', async (req, res) => {
        const idToken = req.body.token;
        const matchUid = req.body.matchUid;
        const message = req.body.message;
        try {
            const AuthData = await admin.auth().verifyIdToken(idToken);
            const nickName = (await admin.firestore().doc(`Users/${AuthData.uid}`).get()).data().nickName;
            const matchData : Match = (await admin.firestore().doc(`Matches/${matchUid}`).get()).data() as Match;
            const matchPrivateData = (await admin.firestore().doc(`Matches_private_data/${matchUid}`).get()).data();

            if(!isPrivate(matchData.groupType) || matchData.creatorUid === AuthData.uid) {
                res.status(418).send('Dobrej pokus :)')
                return null;
            }

            await admin.firestore().doc(`Match_requests/${matchUid}`).collection('requests').doc(AuthData.uid).set({uid: AuthData.uid, message: message});

            await FcmService.Instance.sendMessageToDeviceGroup({
                data: {
                    type: 'match-request'
                },
                notification: {
                    title: `Hráč ${nickName} se chce připojit!`,
                    body: message
                },
                to: matchPrivateData.creatorsToken
            });

            res.status(201).send();
        }
        catch(err) {
            console.log(err);
            res.status(404).send();
        }
    });

    app.post('/createGame', async (req, res) => {
        const idToken = req.body.token;
        const groupType = req.body.type;
        const name = req.body.name;
        const password = req.body.password;
        const token = req.body.messagingToken;

        try{
            const authUid = (await admin.auth().verifyIdToken(idToken));
            const creatorsDoc = admin.firestore().doc(`Users/${authUid.uid}`);
            const cretorsNickName = (await creatorsDoc.get()).data().nickName;

            const matchDoc = admin.firestore().collection('Matches').doc();
            const private_matchDoc = admin.firestore().collection(`Matches_private_data`).doc(matchDoc.id);
            const matchRequestsDoc = admin.firestore().collection('Match_requests').doc(matchDoc.id);

            const promises = [];

            const messToken: string = (await FcmService.Instance.createDeviceGroup({
                notification_key_name: matchDoc.id,
                registrationIds: [token]
            })).notification_key;

            const match: Match = {
                creatorUid: authUid.uid,
                creatorsNickName: cretorsNickName,
                ended: false,
                isPublic: isPublic(groupType),
                groupType: groupType,
                inLobby: true,
                oponentUid: '',
                oponentsNickName: '',
                roomName: name,
                uid: matchDoc.id,
                havepassword: password !== '' && groupType === 'Veřejná',
                messagingToken: messToken
            };
            // Create Match
            promises[0] = matchDoc.set(match);

            // Create private data
            promises[1] = private_matchDoc.set({
                password: password,
                uid: private_matchDoc.id
            });

            // Create doc for request (private match only)
            if(isPrivate(groupType)){
                const matchRequests = {
                    uid: matchRequestsDoc.id,
                }
                promises[2] =  matchRequestsDoc.set(matchRequests);
            }

            // Update creators doc
            promises[3] =  creatorsDoc.update({
                lastMatch: {
                    lastMatchUid: matchDoc.id,
                    creator: true,
                    state: 0
                }
            })

            await Promise.all(promises);
            res.status(201).send();
        }
        catch(err){
            console.log(err);
            res.status(404).send('stala se chyba :(')
        }
    });

    app.post('/sendMessage', async (req, res) => {
        const idToken = req.body.token;

        try {
            const tokenData = await admin.auth().verifyIdToken(idToken);
            const userData = (await admin.firestore().doc(`Users/${tokenData.uid}`).get()).data();
            const matchData = (await admin.firestore().doc(`Matches/${userData.lastMatch.lastMatchUid}`).get()).data()

            await FcmService.Instance.sendMessageToDeviceGroup({
                to: matchData.messagingToken,
                notification: {
                    title: `${userData.nickName} vám poslal správu!`,
                    body: req.body.message
                },
                data: {
                    type: 'match-message',
                    sender: tokenData.uid
                }
            })

            const messDoc = admin.firestore().collection('Messages').doc();
            await messDoc.set({
                uid: messDoc.id,
                message: req.body.message,
                type: 'match-message',
                senderUid: tokenData.uid,
                MatchUid: matchData.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

            res.status(201).send(messDoc.id);
        }
        catch (err) {
            console.log(err);
            res.status(400).send('stala se chyba');
        }
    });

    return app;
}

const isPublic = (type: string) => type !== 'Jen na pozvání';
const isPrivate = (type: string) => type === 'Privátní';


export const matchDeleted = functions.firestore
    .document('Matches/{matchId}')
    .onDelete((snap, context) => {
        return Promise.all([
            admin.firestore().doc(`Matches_private_data/${snap.id}`).delete(),
            admin.firestore().doc(`Match_requests/${snap.id}`).delete()
        ]);
    });

/*
Magic strings:
    match-message
    player-joined
    match-request
*/
