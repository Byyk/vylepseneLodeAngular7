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
        const receiveToken = req.body.token;
        const message = req.body.message;
        const type = req.body.type;

        admin.messaging().send(
            {
                notification:
                {
                    title: "titul",
                    body: "telo"
                },
                token: "cmqA1OiLGAc:APA91bF1kfvjwgYjNL4KPMuysXJ1J-Osssuu_DO1Q8qee6FmWZxU6ZOZyT6yhA0Ue3kWMazMcxHD6hivhy84LhyLmvdved6NGr7l6uCLoHBN6YN90vmHq2V6tFE5lnu4mFWgpk5Bn1LW",
                data: {
                    type: "message"
                }
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
