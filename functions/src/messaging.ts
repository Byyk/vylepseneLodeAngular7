import * as express from 'express';
import * as cors from 'cors';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export function Messaging(){
    const app = express()
    app.use(cors({origin: true}));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.post('/sendMessage', (req, res) => {
        //const body = req.body;

        admin.messaging().send(
          {
            notification:
            {
                title: "titul",
                body: "telo"
            },
            token: "d_3PFuTiiSU:APA91bGKO6Dz1fAds5z8bO5oiOIYiAw7atc3vrTXP3SPYsw4vjfx-ipS1-Jgtl9eZSCA4JA0IvMUfzWIIYt4h5S6uKmf1ZhSIiJcmMg1DA_NdalnT6wzmGiUVnC61Qdrb3c1xzYn8qsT"
          }
        ).then(() => {
            res.status(200).send("odeslano");
        }).catch((err) => {
            console.log(err);
            res.status(404).send("neodeslano");
        })

    });
    return app;
}
