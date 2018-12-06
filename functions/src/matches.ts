import * as express from 'express';
import * as cors from 'cors';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';


export function Matches() {
    const app = express();
    app.use(cors({origin: false}));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.post('/joinGame/public', async (req, res) => {
        const idToken = req.body.token;
        const matchUid = req.body.matchUid;
        const password = req.body.password;
        try{
            const token = await admin.auth().verifyIdToken(idToken);
            const matchPrivateData = await admin.firestore().doc(`Matches_private_data/${matchUid}`).get()
            const matchPassword = matchPrivateData.data().password;
            const nickName = (await admin.firestore().doc(`Users/${token.uid}`).get()).data().nickName

            if(matchPassword !== password && matchPassword !== ''){
                res.status(401).send();
                return null;
            }
            await admin.firestore().doc(`Matches/${matchUid}`).update(
                {
                    oponentUid: token.uid,
                    opopenentsNickName: nickName
            });

            await admin.firestore().collection('Users').doc(token.uid).update({
                    lastMatch: {creator: false, state: 0, lastMatchRef: `Matches/${matchUid}` }
            });

            const message = {
                notification: {
                    title: 'player joined to your game!',
                    body: `player ${nickName} joined to game`
                },
                token: matchPrivateData.data().creatorsToken
            };

            admin.messaging().send(message);
            res.status(200).send();
        }
        catch(err)
        {
          console.log(err);
          res.status(404).send('neplatný token!')
        }
    });

    app.post('/joinGame/sendRequest', async (req, res) => {
        const idToken = req.body.token;
        const matchUid = req.body.matchUid;

        try{
            if((await admin.firestore().doc(`Matches/${matchUid}`).get()).data().groupType === 'Privátní')
            {
                res.status(400).send('Dobrej pokus o vtip vtipálku :)');
                return null;
            }

            const token = await admin.auth().verifyIdToken(idToken);
            const nickName =

            const match = {};
            match[admin.database().ref().push().key] = {
                uid: matchUid,
                usersToken: token
            }
            admin.firestore().doc(`Matches_requests/${matchUid}`)
        }
        catch(err)
        {
            console.log(err);
            res.status(400).send('stala se chyba :(');
        }
    });
    return app;
}

export const matchDeleted = functions.firestore
    .document('Matches/{matchId}')
    .onDelete((snap, context) => {
        return admin.firestore().doc(`Matches_private_data/${snap.id}`).delete();
    });
