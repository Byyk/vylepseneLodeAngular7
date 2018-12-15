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
                    body: message
                },
                token: receiveToken,
                data: {
                    type: type
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
