import sqlize from './sqlize.js';
import Book from './book.js';
import { DataTypes, Model } from 'sequelize';

class BookInstance extends Model {}
BookInstance.init({
    book: {
        type: DataTypes.INTEGER,
        references: {
            model: Book,
            key: 'id'
        }
    },
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
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    url: {
        type: DataTypes.VIRTUAL,
        get() {
            return `/catalog/bookinstance/${this.get('id')}`;
        }
    }


},
{ 
    sequelize: sqlize,
    modelName: 'BookInstances'
});

export default BookInstance;