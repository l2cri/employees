const employeeRouters = require('./employee_routes');

module.exports = function (app, db) {
    employeeRouters(app, db);
    // others routers
}