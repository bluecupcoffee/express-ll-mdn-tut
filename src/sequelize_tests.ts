import sqlize from './models/sqlize.js';
import Book from './models/book.js';
import Author from './models/author.js';
import Genre from './models/genre.js';
import BookInstance from './models/bookinstance.js';
import BookGenre from './models/BookGenre.js';
import { Op } from 'sequelize';
import { generateAuthors, generateGenres, generateBooks, generateBookInstances } from './LibraryFunctions.js';

async function main() {
    await sqlize.sync({force: true});

    console.log(Book.name);
    console.log(Author.name);
    console.log(Genre.name);
    console.log(BookInstance.name);
    console.log(BookGenre.name);

    const authorsList = await generateAuthors(50);
    const genresList = await generateGenres(50);
    const booksList = await generateBooks(50, authorsList, genresList);
    const instanceList = await generateBookInstances(50);
    const instances = await BookInstance.findAll({
        include: Book,
        where: {
            status: {
                [Op.eq]: 'Loaned'
            }
        }
    });
    const bookGenreCount = await BookGenre.count();    
    //console.log(JSON.stringify(instances, null, 2));
    //console.log(JSON.stringify(booksList, null, 2));
    console.log(`Number of created books: ${booksList.length}`);
    console.log(`Number of created instances: ${instanceList.length}`);
    console.log(`Number of book genres: ${bookGenreCount}`);

}

await main();