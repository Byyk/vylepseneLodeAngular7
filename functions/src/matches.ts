import * as express from 'express';
import * as cors from 'cors';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export function Matches() {
    const app = express();
    app.use(cors({origin: true}));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.get('/joinGame/:token/:matchUid/:password*?', (req, res) => {
        const idToken = req.params.token;
        return admin.auth().verifyIdToken(idToken)
            .then((token) => {
                return admin.firestore().collection('Matches_private_data').doc(req.params.matchUid).get().then((data) => {
                    if(data.data().password !== req.params.password && data.data().password !== ''){
                        res.status(401).send();
                        return null;
                    }
                    return admin.firestore().collection('Users').doc(token.uid).update({
                        lastMatch: { creator: false, lastMatchRef: `Matches/:)` }
                      })
                })
            })
            .then(() => {
              res.status(200).send()
            })
            .catch((err) => {
              console.log(err);
              res.status(404).send('neplatný token!')
            });
        });
    return app;
}

export const matchDeleted = functions.firestore
    .document('Matches/{matchId}')
    .onDelete((snap, context) => {
        return admin.firestore().doc(`Matches_private_data/${snap.id}`).delete();
    });
