const usersCollect = "Users"

exports.usersConfigs = function (app, dataLayer) {

    //insert
    app.post("/adduser", function (req, res) {

        if (req.body && typeof req.body.email != 'undefined'
            && typeof req.body.pass != 'undefined'
            && typeof req.body.nickname != 'undefined') {

            console.log(req.body);

            var users = {
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                email : req.body.email,
                nickname : req.body.nickname,
                pass : req.body.pass
            };

            dataLayer.insert(usersCollect, users, function () {
                res.send({ success: true });
            });

        } else {

            res.send({
                success: false,
                errorCode: "PARAM_MISSING"
            });

        }
    });

    //get users
    app.post("/getusers", function (req, res) {

        var page = req.body.page;

        if (page == "connection") {
            document.pseudoUser = req.body.pseudoUser;
            document.mdpUser = req.body.mdpUser;
        }
        if (page == "inscription") {
            if (req.body.inputInscription == "pseudo") document.pseudoUser = req.body.pseudoUser;
            else document.emailUser = req.body.emailUser;
        }
        if (page == "affichenom") {
            document._id = req.body.idUser;
        }
        if (page == "partage") {
            document = {
                $or: [
                    { pseudoUser: req.body.UserPartage },
                    { emailUser: req.body.UserPartage }
                ]
            };
        }

        var filter = {

        };

        dataLayer.get(usersCollect, filter, function (dtSet) {
            res.send(dtSet);
        });
    });

    //update
    app.post('/updateuser/:elem_id', function (req, res) {

        if (req.params.elem_id){

            var ID = req.params.elem_id;

            var data = {
            };

            if (req.body.firstName != null) data.firstName = req.body.firstName;
            if (req.body.lastName != null) data.lastName = req.body.lastName;
            if (req.body.email != null) data.email = req.body.email;
            if (req.body.pseudo != null) data.pseudo = req.body.pseudo;
            if (req.body.pass != null) data.pass = req.body.pass;

            dataLayer.update(usersCollect, ID, data, function (dtSet) {
                res.send(dtSet);
            });

        } else {

            res.send({
                success: false,
                errorCode: "PARAM_MISSING"
            });

        }
    });

    //delete
    app.delete("/deleteuser/:elem_id", function (req, res) {

        if (req.params.elem_id) {

            console.log(req.body);

            var task = {
                _id: req.params.elem_id
            };

            dataLayer.delete(usersCollect, task, function () {
                res.send({ success: true });
            });

        } else {

            res.send({
                success: false,
                errorCode: "PARAM_MISSING"
            });

        }
    });
};