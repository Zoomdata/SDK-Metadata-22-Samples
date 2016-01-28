var users = [];

exports.findAll = function (req, res, next) {
    console.log('search');
    var name = req.query.name;
    if (name) {
        res.send(users.filter(function(user) {
            return (user.username).toLowerCase().indexOf(name.toLowerCase()) > -1;
        }));
    } else {
        res.send(users);
    }
};

exports.findById = function (req, res, next) {
    var id = req.params.id;
    console.log(users[id]);
    res.send(users[id]);
};

exports.setUsers = function (userlist) {
    console.log('setUsers');
    users = userlist;
};