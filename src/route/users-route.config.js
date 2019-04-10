const usersCollect = "Users"

exports.usersConfigs = function (app, dataLayer) {

    //insert
    app.post("/adduser", function (req, res) {

        
        if (req.body && typeof req.body.email != 'undefined'
        && typeof req.body.pass != 'undefined'
        && typeof req.body.nickname != 'undefined') {
            
            //on teste si un user exist ou non.
            console.log(req.body);

            var users = {
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

        var filter = {

        };

        dataLayer.get(usersCollect, filter, function (dtSet) {
            res.send(dtSet);
        });
    });

    //Exist Pseudo
    app.get("/existnickname/:nickname", function (req, res) {

        var filter = {
            "nickname" : req.params.nickname
        };

        dataLayer.get(usersCollect, filter, function (dtSet) {
            console.log(dtSet);
            if(dtSet == null || dtSet.length <=0){
                res.send(false);
            }else{
                res.send(true);
            }
        });
    });
    //Exist Email
    app.get("/existemail/:email", function (req, res) {

        var filter = {
            "email" : req.params.email
        };

        dataLayer.get(usersCollect, filter, function (dtSet) {
            console.log(dtSet);
            if (dtSet == null || dtSet.length <= 0) {
                res.send(false);
            } else {
                res.send(true);
            }
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