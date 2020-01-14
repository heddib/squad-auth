// users hardcoded for simplicity, store in a db for production applications
// const users = [{ id: 1, email: 'test@test.test', username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

const sql = require("../db");
const bcrypt = require("bcryptjs");
const Validator = require("Validator");
const saltRounds = 5;
const salt = bcrypt.genSaltSync(saltRounds);

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
    register,
    getAll,
    getUserByName,
};

async function populateUsers() {
    let promise = new Promise(function(resolve, reject) {
        sql.query("SELECT * FROM users", function(err, data) {
            if (!err) resolve(JSON.parse(JSON.stringify(data)));
            // Hacky solution
            else reject(err);
        });
    });
    promise.then(u => {
        users = u;
    });
    return promise;
}

async function registerUser(user) {
    let promise = new Promise(function(resolve, reject) {
        sql.query("INSERT INTO users SET ?", user, function(err, data) {
            if (!err) resolve(true);
            // Hacky solution
            else reject(err);
        });
    });
    return promise;
}

async function authenticate({ username, password }) {
    await populateUsers();

    //console.log('Replace with : ' + bcrypt.hashSync(password, saltRounds));

    const user = users.find(u => u.username === username);
    if (user) {
        if (bcrypt.compareSync(password, user.password)) {
            console.log("Passowrd is ok -> canLogIn");
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
    }

    /*bcrypt.hash('password', saltRounds, (err, hash) => {
        console.log('Hash of "' + password + '" is : ' + hash);
    })*/

    // const user = users.find(u => u.username === username && u.password === password);
    //const user = users.find(u => u.username === username && u.password === bcrypt.compare(password, u.password));
    /*if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }*/
}

async function register(user) {
    await populateUsers();
    const rules = {
        username: "required",
        // for multiple rules
        email: "required|email",
        firstname: "required",
        lastname: "required",
        password: "required|confirmed",
        password_confirmation: "required",
        type: "required|in:Étudiant,Professionnel",
    };

    const messages = {
        // custom message for based rules
        required: "Le champ :attr est requis",
        email: "L'adresse email n'est pas valide",
    };

    const v = Validator.make(user, rules, messages);

    if (v.fails()) {
        const errors = v.getErrors();
        console.log(errors);
        const data = {
            success: false,
            errors: errors,
        };

        return data;
    }

    // Recherche d'un compte déjà existant avec username
    const userEx = users.find(u => u.username === user.username);
    if (userEx) {
        const data = {
            success: false,
            errors: {
                username: "Ce nom d'utilisateur est déjà utilisé.",
            },
        };
        return data;
    }

    const userExEmail = users.find(u => u.email === user.email);
    if (userExEmail) {
        const data = {
            success: false,
            errors: {
                email: "Cette adresse email est déjà utilisée.",
            },
        };
        return data;
    }

    // Création du compte
    // bcrypt.hashSync(password, saltRounds)

    const date = new Date();

    (user.created_at = date), (user.updated_at = date), (user.password = bcrypt.hashSync(user.password, saltRounds));

    const { password_confirmation, ...insert } = user;
    console.log(insert);

    let promise = await registerUser(insert);

    if(promise) {
        const data = {
            success: true
        };
        return data;
    } else {
        const data = {
            success: false,
            errors: {
                register: 'Erreur lors de l\'inscription.'
            }
        };
        return data;
    }
    
}

async function getAll() {
    await populateUsers();
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

async function getUserByName(username) {
    await populateUsers();
    const user = users.find(u => u.username === username);
    if (user) {
        console.log("getUserByName found " + user.username);
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}