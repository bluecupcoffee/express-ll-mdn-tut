import sqlize from './sqlize.js';
import { DataTypes, Model } from 'sequelize';
import Genre from './genre.js';
import Book from './book.js';

class BookGenre extends Model {
}

BookGenre.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    BookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Book,
            key: 'id',

        },
    },
    GenreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Genre,
            key: 'id'
        }
    }
}, {
    sequelize: sqlize,
    modelName: 'BookGenres',
});

BookGenre.belongsTo(Book, {
    foreignKey: 'BookId',
    constraints: true
});
BookGenre.belongsTo(Genre, {
    foreignKey: 'GenreId',
    constraints: true
})

export default BookGenre;