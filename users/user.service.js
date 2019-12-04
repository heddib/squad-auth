// users hardcoded for simplicity, store in a db for production applications
// const users = [{ id: 1, email: 'test@test.test', username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

const sql = require('../db');

let users = [];

/*const users = () => {
    return new Promise(function(resolve, reject) {
        sql.query("SELECT * FROM users", function(err, data) {
            console.log(data)
            if (!err) resolve(JSON.parse(JSON.stringify(data))); // Hacky solution
            else reject(err);
        });
    });
};*/

module.exports = {
    authenticate,
    getAll
};

async function populateUsers() {
    let promise =  new Promise(function(resolve, reject) {
        sql.query("SELECT * FROM users", function(err, data) {
            if (!err) resolve(JSON.parse(JSON.stringify(data))); // Hacky solution
            else reject(err);
        });
    });
    promise.then(u => {
        users = u;
    });
    return promise;
}

async function authenticate({ username, password }) {
    await populateUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

async function getAll() {
    await populateUsers();
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
