import Sequelize = require("sequelize");
import * as Database from '../Database.json'

const seq = new Sequelize(Database.database, Database.username, Database.password, {
    host: Database.host,
    dialect: Database.dialect,
    operatorsAliases: false,
    // logging: true
});
export function authenticate() {
    seq.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            process.exit(1);
        });
}

const userTable = seq.define('user', {
    username: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING(255)
    }
}, {
    freezeTableName: true,
    tableName: 'users',
    timestamps: false
});

export function insertUser(username, password, onSuccess) {
    userTable.sync().then(() => {
        return userTable.create({
            username: username,
            password: password
        });
    }).then(() => onSuccess());
}

export function queryUser(username, password, onUserNotExist, onWrongPassword, onVerify) {
    userTable.findAll({
        where: {
            username: username
        }
    }).then((hosts: any[]) => {
        const host = hosts[0];
        if (host === undefined) {
            onUserNotExist();
        } else if (host.dataValues.password !== password) {
            onWrongPassword();
        } else {
            onVerify();
        }
    })
}

export function queryUserExistence(username, onUserNotExist, onUserExist) {
    userTable.findAll({
        where: {
            username: username
        }
    }).then((hosts: any[]) => {
            if (hosts.length === 0) {
                onUserNotExist()
            } else {
                onUserExist()
            }
        }
    )
}