import * as express from "express";
import * as cors from "cors";
import * as admin from "firebase-admin";

export const Users = () => {
    const app = express();
    app.use(cors({origin: true}));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.post('/getUsers', (req, res) => {
        const uids: string[] = req.body;
        const promises = [];
        uids.forEach(uid => {
            promises.push(admin.firestore().collection('Users').doc(uid).get());
        });
        Promise.all(promises)
            .then(_users => {
                const result = [];
                _users.forEach(user => {
                    const data = user.data();
                    result.push({ uid: data.uid, nickName: data.nickName });
                });
                res.status(200).send(result);
            })
            .catch(err => {
                console.log(err);
                res.status(404).send("stala se chyba :(");
            })
    });
    return app;
};