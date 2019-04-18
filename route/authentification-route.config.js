var crypto = require('crypto');
const usersCollect = "Users"

exports.authentificationConfigs = function (app, dataLayer, jwt) {

    //login
    app.post("/login/", function (req, res) {

        var text = 'Le pire des salauds se nourrira vers deux heures du matin';

        // On définit notre algorithme de cryptage
        var algorithm = 'aes256';

        // Notre clé de chiffrement, elle est souvent générée aléatoirement mais elle doit être la même pour le décryptage
        var password = req.body.pass;

        // On crypte notre texte
        var cipher = crypto.createCipher(algorithm, password);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');

        var filternickname = {
            "nickname": req.body.nicknameemail,
            "pass": crypted
        };
        var filteremail = {
            "email": req.body.nicknameemail,
            "pass": crypted
        };

        //on test si on trouve le pseudo + pass dans la base de donnée
        dataLayer.get(usersCollect, filternickname, function (dtSet) {
            console.log('login : nickname');
            console.log(dtSet);
            if (dtSet == null || dtSet.length <= 0) {
                //si on ne trouve pas, on cherche avec l'adresse email + pass dans la base de donnée
                dataLayer.get(usersCollect, filteremail, function (dtSet2){
                    console.log('login : email');
                    console.log(dtSet2);
                    if(dtSet2 == null || dtSet2.length <= 0){
                        res.sendStatus(404);
                    }else{
                        var users = {
                            _id: dtSet2[0]._id,
                            email: dtSet2[0].email,
                            nickname: dtSet2[0].nickname,
                            pass: dtSet2[0].pass
                        };

                        jwt.sign({ users }, 'secretkey', {expiresIn: '7200s'}, (err, token) =>{
                            res.json({
                                token
                            });
                        });
                    }
                });
            } else {
                var users = {
                    _id: dtSet[0]._id,
                    email: dtSet[0].email,
                    nickname: dtSet[0].nickname,
                    pass: dtSet[0].pass
                };
                jwt.sign({ users }, 'secretkey', { expiresIn: '7200s' }, (err, token) => {
                    res.json({
                        token
                    });
                });
            }
        });
    });

    app.post('/login/isconnect', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                res.sendStatus(200);
                /*res.json({
                    message: 'Post Success...',
                    authData
                });*/
            }
        });
    });

    app.post('/getMyself', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                //res.sendStatus(200);
                console.log(authData);
                var myself = {
                    email : authData.users.email,
                    nickname : authData.users.nickname
                }

                res.json(myself);
            }
        });
    });

    // FORMAT OF TOKEN
    // Authorization: Token <access_token>

    // Verify Token
    function verifyToken(req, res, next) {
        // Get auth header value
        const bearerHeader = req.headers['authorization'];
        // Check if bearer is undefined
        if (typeof bearerHeader !== 'undefined') {
            // Split at the space
            const bearer = bearerHeader.split(' ');
            // Get token from array
            const bearerToken = bearer[1];
            // Set the token
            req.token = bearerToken;
            // Next middleware
            next();
        } else {
            // Forbidden
            res.sendStatus(403);
        }

    }
};