import sqlize from './sqlize.js';
import Book from './book.js';
import { DateTime }  from 'luxon';
import { DataTypes, Model } from 'sequelize';

class BookInstance extends Model {}
BookInstance.init({
    imprint: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'imprint'
    },
    status: {
        type: DataTypes.ENUM({
            values: ['Available', 'Maintenance', 'Loaned', 'Reserved']
        }),
        defaultValue: 'Available',
        allowNull: false
    },
    due_back: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    url: {
        type: DataTypes.VIRTUAL,
        get() {
            return `/catalog/bookinstance/${this.get('id')}`;
        }
    },
    due_back_formatted: {
        type: DataTypes.VIRTUAL,
        get() {
            return DateTime.fromJSDate(this.get('due_back') as Date)
                .toLocaleString(DateTime.DATE_MED);
        }
    },
    due_back_yyyy_mm_dd: {
        type: DataTypes.VIRTUAL ,
        get() {
            return DateTime.fromJSDate(this.get('due_back') as Date)
                .toFormat('yyyy-MM-dd');
        }
    }


},
{ 
    sequelize: sqlize,
    modelName: 'BookInstances'
});

Book.hasMany(BookInstance);
BookInstance.belongsTo(Book);

export default BookInstance;