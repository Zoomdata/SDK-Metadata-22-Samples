var express = require('express'),
    users = require('./routes/users'),
    http = require("http"),
    https = require("https"),
    _ = require('lodash'),
    app = express();

app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/users', users.findAll);
app.get('/users/:id', users.findById);

app.get('/userlist', function(req, res, next){

    var options = {
        host: 'dev.zoomdata.com',
        port: 443,
        path: '/zoomdata/api/users',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':'Basic c3VwZXJ2aXNvcjpzdXBlcnZpc29y'
        }
    };

    var request = https.request(options, function(response){
        var str = '';
        var userList = {};
        console.log(options.host + ':' + response.statusCode);
        response.setEncoding('utf8');

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            userList = JSON.parse(str);
            var userId = 0;
            _(userList.data).forEach(function(user) {
                user.id = userId++;
                user.picId = Math.floor((Math.random() * 12) + 1);
            });

            users.setUsers(userList.data);
            res.send(userList.data);
        });
    });

    request.on('error', function(err) {
        console.log('ERROR: ' + err.message);
    });

    request.end();

});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});