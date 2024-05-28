import { Sequelize } from 'sequelize';

const sqlize = new Sequelize({
    dialect: 'mariadb',
    host: 'localhost',
    username: 'root',
    password: 'secretpass',
    database: 'np'
});

export default sqlize;