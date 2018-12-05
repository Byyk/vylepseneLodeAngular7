import * as express from 'express';
import * as cors from 'cors';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export function Matches() {
    const app = express();
    app.use(cors({origin: false}));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.get('/joinGame/:token/:matchUid/:password*?', async (req, res) => {
        const idToken = req.params.token;
        try{
        const token = await admin.auth().verifyIdToken(idToken);
        const matchPrivateData = await admin.firestore().doc(`Matches_private_data/${req.params.matchUid}`).get()
        const matchData = await admin.firestore().doc(`Matches/${req.params.matchUid}`).get();
        if(matchPrivateData.data().password !== req.params.password && matchPrivateData.data().password !== ''){
            res.status(401).send();
            return null;
        }
        if(matchData.data().groupType === 'Privátní'){
            res.status(201).send();
            return null;
        }
        const nickName = (await admin.firestore().doc(`Users/${token.uid}`).get()).data().nickName
        await admin.firestore().doc(`Matches/${req.params.matchUid}`).update(
            {
                oponentUid: token.uid,
                opopenentsNickName: nickName
        });
        await admin.firestore().collection('Users').doc(token.uid).update({
                lastMatch: {creator: false, state: 0, lastMatchRef: `Matches/${req.params.matchUid}` }
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
    return app;
}

export const matchDeleted = functions.firestore
    .document('Matches/{matchId}')
    .onDelete((snap, context) => {
        return admin.firestore().doc(`Matches_private_data/${snap.id}`).delete();
    });
