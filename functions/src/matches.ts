import { LastMatch } from './../../src/app/model/hrac.model';
import * as express from 'express';
import * as cors from 'cors';
import * as admin from "firebase-admin";

export function Matches() {
    const app = express();
    app.use(cors({origin: true}));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.get('/joinGame/:token/:matchUid',async (req, res) => {
        const idToken = req.params.token;
        admin.auth().verifyIdToken(idToken)
            .then((token) => {
                admin.firestore().collection('Users').doc(token.uid).update({
                  lastMatch: { creator: false, lastMatchRef: `Matches/:)` }
                })
            })
            .catch((err) => {
               console.log(err);
               res.status(404).send('neplatný token!');
            });
    });
    return app;
}
