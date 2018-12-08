import * as express from 'express';
import * as cors from 'cors';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Match, MatchPrivateData } from '../../src/app/model/match.model'

export function Matches() {
    const app = express();
    app.use(cors({origin: false}));
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
            const matchData = (await matchDoc.get()).data();

            if(matchPrivateData.data().password !== password && matchPrivateData.data().password !== ''){
                res.status(401).send('špatné heslo!');
                return null;
            }

            if(matchData.groupType !== 'Veřejný'){
                res.status(418).send('dobrej pokus :)');
                return null;
            }

            if(matchData.oponentUid === '' ){
                res.status(410).send('k zápasu je již někdo připojen!');
                return null;
            }

            const nickName = (await admin.firestore().doc(`Users/${token.uid}`).get()).data().nickName
            await matchDoc.update({
                oponentUid: token.uid,
                opopenentsNickName: nickName
            });

            await admin.firestore().collection('Users').doc(token.uid).update({
                lastMatch: {creator: false, state: 0, lastMatchRef: `Matches/${matchUid}` }
            })

            const message = {
                notification: {
                    title: 'player joined to your game!',
                    body: `player ${nickName} joined to game`
                },
                token: matchPrivateData.data().creatorsToken
            }

            admin.messaging().send(message);
            res.status(200).send();
        }
        catch(err)
        {
          console.log(err);
          res.status(404).send('neplatný token!')
        }
    });

    app.post('/createGame', async (req, res) => {
        const idToken = req.body.token;
        const groupType = req.body.type;
        const name = req.body.name;
        const password = req.body.password;

        try{
            const authUid = (await admin.auth().verifyIdToken(idToken));
            const creatorsDoc = admin.firestore().doc(`Users/${authUid.uid}`);
            const cretorsNickName = (await creatorsDoc.get()).data().nickName;

            const matchDoc = admin.firestore().collection('Matches').doc();
            const private_matchDoc = admin.firestore().collection(`Matches_private_data`).doc(matchDoc.id);
            const matchRequestsDoc = admin.firestore().collection('MatchRequests').doc(matchDoc.id);

            const promises = [];

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
                havepassword: password !== '' && groupType === 'Veřejná'
            };
            promises[0] = matchDoc.set(match);

            promises[1] = private_matchDoc.set({
                creatorsToken: '',
                password: password,
                uid: private_matchDoc.id
            });

            const matchRequests = {
                uid: matchRequestsDoc.id,
                requests: {}
            }
            promises[2] =  matchRequestsDoc.set(matchRequests);


            promises[3] =  creatorsDoc.update({
                lastMatch: {
                    lastMatchRef: `Matches/${matchDoc.id}`,
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


    return app;
}

const isPublic = (type: string) => type !== 'Jen na pozvání';

export const matchDeleted = functions.firestore
    .document('Matches/{matchId}')
    .onDelete((snap, context) => {
        return admin.firestore().doc(`Matches_private_data/${snap.id}`).delete();
    });
