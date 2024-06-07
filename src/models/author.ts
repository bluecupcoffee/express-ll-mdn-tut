import { DataTypes, Model } from 'sequelize';
import { DateTime } from 'luxon';
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
            return `/catalog/author/${this.get('id')}`;
        }
    },
    name: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.get('first_name')} ${this.get('family_name')}`;
        }
    },
    date_of_birth_formatted: {
        type: DataTypes.VIRTUAL,
        get() {
            return DateTime.fromJSDate(this.get('date_of_birth') as Date)
                    .toLocaleString(DateTime.DATETIME_MED);
        }
    },
    date_of_death_formatted: {
        type: DataTypes.VIRTUAL,
        get() {
            if (this.get('date_of_death') === null) {
                return "N/A"
            } else {
                DateTime.fromJSDate(this.get('date_of_death') as Date)
                    .toLocaleString(DateTime.DATETIME_MED);
            }
        }
    },
    date_of_birth_formatted2: {
        type: DataTypes.VIRTUAL,
        get() {
            if (this.get('date_of_birth') === null) {
                return null
            } else {
            return DateTime.fromJSDate(this.get('date_of_birth') as Date)
                    .toFormat("yyyy-MM-dd");
            }
        }
    },
    date_of_death_formatted2: {
        type: DataTypes.VIRTUAL,
        get() {
            if (this.get('date_of_death') === null) {
                return null;
            } else {
            return DateTime.fromJSDate(this.get('date_of_death') as Date)
                    .toFormat("yyyy-MM-dd");
            }
        }
    }
}, {
    sequelize: sqlize,
    modelName: 'Authors'
});

export default Author;