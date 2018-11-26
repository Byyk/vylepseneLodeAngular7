import * as express from 'express';
import * as cors from 'cors';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export function Matches() {
    const app = express();
    app.use(cors({origin: true}));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.get('/joinGame/:token/:matchUid/:password*?', async (req, res) => {
        const idToken = req.params.token;
        try{
        const token = await admin.auth().verifyIdToken(idToken);
        const matchPrivateData = await admin.firestore().collection('Matches_private_data').doc(req.params.matchUid).get()
            if(matchPrivateData.data().password !== req.params.password && matchPrivateData.data().password !== ''){
                res.status(401).send();
                return null;
            }
            await admin.firestore().collection('Users').doc(token.uid).update({
                lastMatch: { creator: false, state: 0, lastMatchRef: `Matches/${req.params.matchUid}` }
            })
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
