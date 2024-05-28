import { DataTypes, Model } from 'sequelize';
import sqlize from './sqlize.js';

class Author extends Model {}
Author.init({
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    family_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false
    },
    date_of_death: {
        type: DataTypes.DATE,
        allowNull: true
    },
    url: {
        type: DataTypes.VIRTUAL,
        get() {
            return `/catalog/authors/${this.get('id')}`;
        }
    },
    name: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.get('first_name')} ${this.get('family_name')}`;
        }
    },
}, {
    sequelize: sqlize,
    modelName: 'Authors'
});

export default Author;