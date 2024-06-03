import sqlize from './sqlize.js';
import {DataTypes, Model} from 'sequelize';
import Author from './author.js';
import BookGenre from './BookGenre.js';
import Genre from './genre.js';

class Book extends Model {
}
Book.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    summary: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ISBN: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    url: {
        type: DataTypes.VIRTUAL,
        get() {
            return `/catalog/book/${this.get('id')}`;
        }
    },
}, {
    sequelize: sqlize,
    modelName: 'Books'
});

Author.hasMany(Book);
Book.belongsTo(Author);
export default Book;