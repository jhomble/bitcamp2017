// routes.js

module.exports = function(app) {
    app.get('*', function(req, res) {
            res.sendfile('./public/app/index.html'); // load our public/index.html file
    });
};
