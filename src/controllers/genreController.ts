import Genre from "../models/genre.js";
import Book from "../models/book.js";
import BookGenre from "../models/BookGenre.js";
import { Op } from 'sequelize';
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import HttpError from "../models/HttpError.js";


// Display list of all Genre.
export const genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.findAll();
    res.render("genre_list",{
        title: "Genre List",
        genre_list: allGenres
    });
});

// Display detail page for a specific Genre.
export const genre_detail = asyncHandler(async (req, res, next) => {
    
    const booksInGenre = BookGenre.findAll({
        include: Book,
        where: {
            GenreId: req.params.id
        },
    });

    const genreDetails = Genre.findByPk(req.params.id);

    var [booksInGenreOut, genreDetailsOut] = await Promise.all([booksInGenre, genreDetails]);
    console.log(JSON.stringify(booksInGenreOut, null, 2));
    res.render("genre_detail", {
        genre: genreDetailsOut,
        genre_books: booksInGenreOut
    });
    

});

// Display Genre create form on GET.
export const genre_create_get = asyncHandler(async (req, res, next) => {
    res.render("genre_form", {
        title: "Create genre"
    });
});

// Handle Genre create on POST.
export const genre_create_post = [
    body("name", "Genre name must be at least 3 letters")
        .trim()
        .isLength({min: 3})
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(res);
        const protoGenre = new Genre({
            name: req.body.name
        });

        if(!errors.isEmpty()) {
            res.render("genre_form", {
                title: "Create genre",
                genre: protoGenre,
                errors: errors.array()
            });
            return;
        } else {
            const genreCheck = await Genre.findOne({
                where: {
                    name: req.body.name
                }
            });

            if(genreCheck!==null) {
                res.redirect(genreCheck.get('url') as string)
            } else {
                const savedGenre = await protoGenre.save();
                res.redirect(savedGenre.get('url') as string);
            }
        }
    })
]

// Display Genre delete form on GET.
export const genre_delete_get = asyncHandler(async (req, res, next) => {
    const genreProm = Genre.findByPk(req.params.id);
    const booksProm = BookGenre.findAll({
        where: {
            GenreId: req.params.id
        },
        include: Book
    });

    const [genre, books] = await Promise.all([genreProm, booksProm]);
    console.log(JSON.stringify(books, null, 2));
    if(genre===null) {
        res.status(404).send("Genre not found");
        return;
    }

    res.render("genre_delete", {
        title: "Delete genre",
        genre: genre,
        genre_books: books
    });
});

// Handle Genre delete on POST.
export const genre_delete_post = asyncHandler(async (req, res, next) => {
    const genreProm = Genre.findByPk(req.params.id);
    const bookGenreProm = BookGenre.findAll({
        where: {
            GenreId: req.params.id
        }
    });

    const [genre, bookGenres] = await Promise.all([genreProm, bookGenreProm]);
    if(genre===null) {
        res.status(404).send("Genre not found");
        return;
    }
    try {
        bookGenres.forEach( async (bg) => {
            await bg.destroy();
        });
    } catch (err) {
        throw new HttpError(500, `Error occurred while deleting Book-Genre relations:\n${JSON.stringify(err, null, 2)}`);
    }

    try {
        await genre.destroy();
    } catch (err) {
        throw new HttpError(500, `Error occurred while deleting Genre:\n${JSON.stringify(err, null, 2)}`);
    }

    res.redirect("/catalog/genres");
});

// Display Genre update form on GET.
export const genre_update_get = asyncHandler(async (req, res, next) => {
    const genre = await Genre.findByPk(req.params.id);
    const genreBooks = await BookGenre.findAll({
        where: {
            GenreId: req.params.id
        }
    });

    if(genre===null) {
        res.status(404).send("Genre not found");
        return;
    }
    res.render("genre_form", {
        genre: genre,
        genre_books: genreBooks
    });


});

// Handle Genre update on POST.
export const genre_update_post = [
    body("name", "Genre must be longer than 3 characters")
        .trim()
        .isLength({min: 3})
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(res);

        const genre = await Genre.findByPk(req.params.id);
        if(genre===null) {
            res.status(404).send("Genre not found");
            return;
        }

        if(!errors.isEmpty()) {
            res.render("genre_form", {
                genre: genre,
                title: "Create genre",
                errors: errors
            });
            return;
        }

        genre.set({
            name: req.body.name
        });

        await genre.save();
        res.redirect(genre.get('url') as string);
        

    })
]