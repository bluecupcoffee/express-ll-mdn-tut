import sqlize from './models/sqlize.js';
import Book from './models/book.js';
import Author from './models/author.js';
import Genre from './models/genre.js';
import BookInstance from './models/bookinstance.js';
import { Op } from 'sequelize';
import { generateAuthors, generateGenres, generateBooks } from './LibraryFunctions.js';

async function main() {
    await sqlize.sync();

    console.log(Book.name);
    console.log(Author.name);
    console.log(Genre.name);
    // console.log(BookInstance.name);
    // console.log(BookGenre.name);

    const authorsList = await generateAuthors(50);
    const genresList = await generateGenres(50);
    // console.log(`AUTHORS:${authorsList.length}\n${JSON.stringify(authorsList, null, 2)}`);
    // console.log(`GENRES:${genresList.length}\n${JSON.stringify(genresList, null, 2)}`);
    const booksList = await generateBooks(50, authorsList, genresList);
    const checkCount = await BookInstance.findAndCountAll({
        where: {
            status: {
                [Op.eq]: 'Available'
            }
        }
    });
    console.log(`NUMBER OF BOOKS WITH ID ABOVE 10: ${checkCount.count}`);

    //console.log(JSON.stringify(booksList, null, 2));


}

await main();