function localStorageSET(key, value) {
    localStorage.setItem(key,value);
};

function localStorageGET(key, defaultValue) {
    return localStorage.getItem(key) || defaultValue || false;
};

function localStorageREMOVE(key) {
    localStorage.removeItem(key);
};

function localStorageCLEAR() {
    localStorage.clear;
}

function isConnect(http) {
    /*token = localStorageGET('token', false);
    if(token != false){

        const httpOptions = {
            headers: {
                'Authorization': token
            }
        };

        const env = http.post('/login/isconnect',{},httpOptions)
            .then(function (data) {
                console.log(data);
                if(data.status == 200){
                    return true;
                }
            })
            .catch(function (data) {
                console.log('Error: ' + data);
                return false;
            })
            .finally(function () {
                console.log('finally');
            });

        console.log(env);
        return env.value;
    }else{
        return false;
    }*/
    if (localStorageGET('token', false) == false){
        return false;
    }else{
        return true;
    }
}