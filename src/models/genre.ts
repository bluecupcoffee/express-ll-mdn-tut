import sqlize from './sqlize.js';
import { DataTypes, Model} from 'sequelize';

class Genre extends Model {
}
Genre.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.VIRTUAL,
        get() {
            return `/catalog/genre/${this.get('id')}`;
        }
    }
}, {
    sequelize: sqlize,
    modelName: 'Genres'
});

export default Genre;