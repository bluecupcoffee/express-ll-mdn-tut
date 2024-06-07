import Book from "../models/book.js";
import Genre from "../models/genre.js";
import Author from "../models/author.js";
import { Op } from "sequelize";
import BookInstance from "../models/bookinstance.js";
import BookGenre from "../models/BookGenre.js";
import { body, validationResult } from "express-validator";
import HttpError from "../models/HttpError.js";

import asyncHandler from "express-async-handler";

export const index = asyncHandler(async (req, res, next) => {
    const [
        numBooks,
        numBookInstances,
        numAvailableBookInstances,
        numAuthors,
        numGenres
    ] = await Promise.all([
        Book.count(),
        BookInstance.count(),
        BookInstance.count({
            where: {
                status: {
                    [Op.eq]: 'Available',
                }
            }
        }),
        Author.count(),
        Genre.count()
    ]);

    res.render("index", {
        title: "Local Library Home",
        book_count: numBooks,
        book_instance_count: numBookInstances,
        book_instance_available_count: numAvailableBookInstances,
        author_count: numAuthors,
        genre_count: numGenres
    });
});

// Display list of all books.
export const book_list = asyncHandler(async (req, res, next) => {
    const allBooks = await Book.findAll({
        include: Author
    });
    
    res.render("book_list", {title: "Book List", book_list: allBooks});
});

// Display detail page for a specific book.
export const book_detail = asyncHandler(async (req, res, next) => {
    const bookProm = Book.findByPk(req.params.id, {
        include: [Author]
    });

    const bookInstancesProm = BookInstance.findAll({
        where: {
            BookId: req.params.id
        }
    });

    const bookGenresProm = BookGenre.findAll({
        where: {
            BookId: req.params.id
        },
        include: Genre
    });
    
    const [ book,
            bookInstances,
            bookGenres
        ] = await Promise.all(
        [   bookProm,
            bookInstancesProm,
            bookGenresProm
        ]);
    res.render("book_detail", {
        book: book,
        book_instances: bookInstances,
        book_genres: bookGenres,
    });
});

// Display book create form on GET.
export const book_create_get = asyncHandler(async (req, res, next) => {
    const [allAuthors, allGenres] = await Promise.all([
        Author.findAll({
            order: [
                ['family_name', 'ASC']
            ]
        }),
        Genre.findAll({
            order: [
                ['name', 'ASC']
            ]
        })
    ]);
    res.render("book_form", {
        title: "Create book",
        authors: allAuthors,
        genres: allGenres
    });
});

// Handle book create on POST.
export const book_create_post = [
    (req: any, res: any, next: any) => {
        if(!Array.isArray(req.body.genre)) {
            req.body.genre = 
                typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }
        next();
    },

    body("title", "Title must not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("author", "Author must not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("summary", "Summary must not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("isbn", "ISBN must not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("genre.*")
        .escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);

        const book = await Book.create({
            title: req.body.title,
            AuthorId: req.body.author,
            summary: req.body.summary,
            ISBN: req.body.isbn,
        });

        if(!errors.isEmpty()) {
            const[ allAuths, allGenres, bookGenres ] = await Promise.all([
                Author.findAll({
                    order: [
                        ['family_name', 'ASC']
                    ]
                }),
                Genre.findAll({
                    order: [
                        ['name', 'ASC']
                    ]
                }),
                BookGenre.findAll({
                    where: {
                        BookId: book.get('id')
                    }
                })
            ]);

            const bookGenreIds = bookGenres.map(bg => bg.get('GenreId') as number)
            for(const genre of allGenres) {
                if(bookGenreIds.includes(genre.get('id') as number)) {
                    genre.checked = true;
                }
            }

            res.render("book_form", {
                title: "Create Book",
                authors: allAuths,
                genres: allGenres,
                book: book,
                errors: errors.array()
            });
        } else {
            await book.save({

            })
            res.redirect(book.get('url')as string);
        }

    })

]

// Display book delete form on GET.
export const book_delete_get = asyncHandler(async (req, res, next) => {
res.send("NOT IMPLEMENTED: Book delete GET");
});

// Handle book delete on POST.
export const book_delete_post = asyncHandler(async (req, res, next) => {
res.send("NOT IMPLEMENTED: Book delete POST");
});

// Display book update form on GET.
export const book_update_get = asyncHandler(async (req, res, next) => {
    const [book, allAuthors, allGenres, allBookGenres] = await Promise.all([
        Book.findByPk(req.params.id, {
            include: Author
        }),
        Author.findAll({
            order: [
                ['family_name', 'ASC']
            ]
        }),
        Genre.findAll({
            order: [
                ['name', 'ASC']
            ]
        }),
        BookGenre.findAll({
            attributes: ['GenreId'],
            where: {
                BookId: req.params.id
            }
        })
    ]);

    if (book === null) {
        const err = new HttpError(404, "Book not found");
        return next(err);
    }

    allGenres.forEach(genre => {
        if (allBookGenres.map(abg => abg.get('GenreId') as number).includes(genre.get('id') as number)) {
            genre.checked = true
        }
    })
    res.render("book_form",{
        title: "Update book",
        authors: allAuthors,
        genres: allGenres,
        book: book
    });
});

// Handle book update on POST.
export const book_update_post = [
    (req: any, res: any, next: any) => {
        if(!Array.isArray(req.body.genre)) {
            req.body.genre = 
                typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }
        next()
    },

    body("title", "Title must not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("author", "Author must not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("summary", "Summary must not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("isbn", "ISBN must not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("genre.*")
        .escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);

        const book = await Book.findByPk(req.params.id);

        if(!errors.isEmpty()) {
            const [allAuths, allGenres, bookGenres] = await Promise.all([
                Author.findAll({
                    order: [
                        ['family_name', 'ASC']
                    ]
                }),
                Genre.findAll({
                    order: [
                        ['name', 'ASC']
                    ]
                }),
                BookGenre.findAll({
                    where: {
                        BookId: req.params.id
                    }
                })
            ]);

            for(const genre of allGenres) {
                if(bookGenres.map(bgs => bgs.get('GenreId') as number).includes(genre.get('id') as number)) {
                    genre.checked = true;
                }
            }

            res.render("book_form", {
                title: "Update book",
                authors: allAuths,
                book: book,
                genres: allGenres,
                errors: errors.array()
            });
            return;
        }  else {
            const updatedBook = await Book.findByPk(req.params.id);
            if (updatedBook===null) {
                throw new HttpError(500, "Book returned null");
            }
            console.log(`REQ BODY########################################################\n${JSON.stringify(req.body, null, 2)}`);
            
            // attempt updating book 
            try{
                await updatedBook.set({
                    title: req.body.title,
                    ISBN: req.body.isbn,
                    summary: req.body.summary,
                    AuthorId: req.body.author
                });
    
                await updatedBook.save();
            } catch (err) {
                throw new HttpError(500, "Error updating book");
            }
            console.log(`UPDATED BOOK#######################################################\n${JSON.stringify(updatedBook, null, 2)}`);
            // get current book genres from DB
            const currentBGs = await BookGenre.findAll({
                where: {
                    BookId: req.params.id
                }
            });
            console.log(`ALL GENRES RELATED TO BOOK##########################################\n${JSON.stringify(currentBGs, null, 2)}`);
            // get form genres from form
            let formGenreIds: number[] = [];
            req.body.genre.forEach( (item: any) => {
                try{
                    formGenreIds.push(parseInt(item, 10));
                } catch (err) {
                    throw new HttpError(500, "Error parsing genre IDs");
                }
            });

            // remove anything that isn't in the form genre list by
            // deleting a currentBookGenre if it isn't in the form bookgenres

            const currentMappedBGs = currentBGs.map(cBGs => cBGs.get('GenreId') as number);
            console.log(`NUMBERIZED BOOKGENRE ARRAY###########################################\n${JSON.stringify(currentMappedBGs, null, 2)}`);
            let removedGenreId: number[] = [];
            for(let i = 0; i < currentBGs.length; i++) {
                if(!formGenreIds.includes(currentBGs[i].get('GenreId')as number)) {
                    removedGenreId.push(currentBGs[i].get('id') as number)
                }
            }

            console.log(`UNCHECKED BOOKGENRE IDs####################################################\n${JSON.stringify(removedGenreId, null, 2)}`);
            // actually do the removal
            removedGenreId.forEach(async (bgi) => {
                const del = await BookGenre.findByPk(bgi);
                if(del){
                    await del.destroy();
                }
            });

            // add anything that isn't in the current genre list
            // create a record using the form genre id if it isn't
            // in the current bookgenre list
            let newBookGenrePromises: Promise<BookGenre>[] = [];
                    const mappedBGs = currentBGs.map(cBG => cBG.get('GenreId') as number);
                    formGenreIds.forEach( fGI => {
                        if(!mappedBGs.includes(fGI)) {
                            const newBookGenre = BookGenre.create({
                                BookId: req.params.id,
                                GenreId: fGI
                            });

                            newBookGenrePromises.push(newBookGenre);                            
                        }
                    });

            await Promise.all(newBookGenrePromises);
            res.redirect(updatedBook?.get('url')as string);


        }
    })
];