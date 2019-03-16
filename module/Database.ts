import Sequelize = require("sequelize");
import waitForUserInput = require("wait-for-user-input");
import * as Database from '../Database.json'


const seq = new Sequelize(Database.database, Database.username, Database.password, {
    define: {
        charset: 'utf8',
        collate: 'utf8_bin'// 二进制索引，避免大小写错误
    },
    host: Database.host,
    dialect: Database.dialect,
    operatorsAliases: false,
    logging: false
});

const userTable = seq.define('user', {
    username: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(255)
    }
}, {
    freezeTableName: true,
    tableName: 'users',
    timestamps: false
});

export function db_init() {
    seq.authenticate()
        .then((async () => {
            console.log('Connection has been established successfully.');
        }), (err) => {
            console.error('Unable to connect to the database:', err);
            process.exit(1);
        })
        .then(() => {
            seq.query('SELECT 1 FROM users LIMIT 1').then(
                (async () => {// 表存在，不用担心
                    await waitForUserInput("you already have the users table, please backup and restore all data." +
                        "The programme will rebuild your table to blank.Press enter to continue.")
                }), (() => {// 表不存在，准备创建
                    userTable.sync({force: true}).catch((err) => {
                        console.error(err)
                    })
                })
            )
        })
        .catch(err => {
            console.error("something bad had happened", err)
        });
}

export function insertUser(username, password, onSuccess) {
    userTable.create({
        username: username,
        password: password
    }).then(() => onSuccess());
    // userTable.sync().then(() => {
    //     return userTable.create({
    //         username: username,
    //         password: password
    //     });
    // }).then(() => onSuccess());
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