import sqlize from './sqlize.js';
import {DataTypes, Model} from 'sequelize';
import Author from './author.js';

class Book extends Model {
}
Book.init({
    authorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Author,
            key: 'id'
        }
    },
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
    genres: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    url: {
        type: DataTypes.VIRTUAL,
        get() {
            return `/catalog/books/${this.get('id')}`;
        }
    }
}, {
    sequelize: sqlize,
    modelName: 'Books'
});

export default Book;