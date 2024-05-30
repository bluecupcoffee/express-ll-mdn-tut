import sqlize from './models/sqlize.js';
import Book from './models/book.js';
import Author from './models/author.js';
import Genre from './models/genre.js';
import BookInstance from './models/bookinstance.js';

export async function createBook(authorIn: Author, bookTitleIn: String, genresIn?: Genre[]) {
    // rng uniqueness
    const current_time = new Date().getMilliseconds();
    const newBook = await Book.create({
        title: `${bookTitleIn} ${current_time}`,
        AuthorId: authorIn.get('id'),
        genres: genresIn?.map( gen => gen.get('id'))
    });
    return newBook;
}

export async function createAuthor( firstName: String, 
                                    lastName: String,
                                    dob: Date,
                                    dod?: Date) {
    const current_time = new Date().getMilliseconds();
    const newAuthor = await Author.create({
        first_name: `${firstName} ${current_time}`,
        family_name: lastName,
        date_of_birth: dob,
        date_of_death: dod
    });
    return await newAuthor;
}

export async function createGenre(genreName: String) {
    const current_time = new Date().getMilliseconds();
    const newGenre = await Genre.create({
        name: `${genreName} ${current_time}`
    });
    return await newGenre;
}

export async function createBookInstance(inBookId: number,
    inPrint: String,
    inStatus: String,
    dueBack: Date
) {
    const newInstance = await BookInstance.create({
        bookId: inBookId,
        imprint: inPrint,
        status: inStatus,
        due_back: dueBack
    });

    return newInstance;
}

export async function generateAuthors(numAuthors: number) {
    let authorArray: Promise<Author>[] = [];
    for(let i = 0; i < numAuthors; i++) {
        const authorProm = createAuthor(
                                Math.random().toString().substring(2, 6),
                                Math.random().toString().substring(2, 6),
                                new Date(),
            );
        authorArray.push(authorProm);
    }
    return await Promise.all(authorArray);
}

export async function generateGenres(numGenres: number) {
    let genreArray: Promise<Genre>[] = [];
    for(let i = 0; i < numGenres; i++) {
        const genreProm = createGenre(
            Math.random().toString().substring(2, 6)
        );
        genreArray.push(genreProm);
    }
    return await Promise.all(genreArray);
}

export async function generateBooks(numBooks: number, authors: Author[], genres: Genre[]) {
    let bookArray: Promise<Book>[] =[];
    const milli = new Date().getMilliseconds();
    for(let i = 0; i < numBooks; i++) {
        // rng some genres
        let numGenres = Math.floor(Math.random() * 6);
        numGenres = numGenres < 1 ? 1 : numGenres;



        let bookGenres: Genre[] = [];
        for(let j = 0; j < numGenres; j++) {
            const genreNo = Math.floor(Math.random() * genres.length);
            bookGenres.push(genres[genreNo]);
        }
        
        const bookProm = createBook(
            authors[Math.floor(Math.random() * (authors.length - 1))],
            `Book ${milli} ${i}`,
            bookGenres
        );
        bookArray.push(bookProm);
    }
    return await Promise.all(bookArray);
}

export async function generateBookInstances(numInstances: number){
    // for storing list of bookinstances
    let promList: Promise<BookInstance>[] = [];
    // get all books and generate instances of them
    const books = await Book.findAll();


    for(let i = 0; i < numInstances; i++) {
        let rando = Math.random();
        const bookId = books[Math.floor(books.length * rando)]
                        .get('id') as number;
        rando = rando > 0.50 ? 2 : 3;
        // create 2 or 3 instances
        for(let j = 0; j < rando; j++) {
            var newDate = new Date()
            const bookInst = createBookInstance(
                bookId,
                "Something about imprint",
                'Loaned',
                new Date(addDays(new Date(), 7))
            );
            promList.push(bookInst);
        }
    }
    const instances = await Promise.all(promList);
    return instances;

}

function addDays(date: Date, days: number) {
    const curr_date = new Date(date);
    const future_date = curr_date.setDate(curr_date.getDate() + days);
    return future_date;
}