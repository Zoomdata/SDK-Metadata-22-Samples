userService = (function () {

    var baseURL = "";

    // The public API
    return {
        findAll: function() {
            return $.ajax(baseURL + "/users");
        },
        findById: function(id) {
            return $.ajax(baseURL + "/users/" + id);
        },
        findByName: function(searchKey) {
            return $.ajax({url: baseURL + "/users", data: {name: searchKey}});
        },
        findAllUsers: function() {
            return $.ajax(baseURL + "/userlist");
        }
    };

}());