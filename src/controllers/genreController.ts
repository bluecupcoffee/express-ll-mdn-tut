import Genre from "../models/genre.js";
import Book from "../models/book.js";
import { Op } from 'sequelize';
import asyncHandler from "express-async-handler";


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
    const genre = Genre.findByPk(req.params.id);
    const booksInGenre = Book.findAll();

    var [genreOut, booksInGenreOut] = await Promise.all([genre, booksInGenre]);
    
    res.render("genre_detail", {
        genre: genreOut,
        genre_books: booksInGenreOut
    });
    

});

// Display Genre create form on GET.
export const genre_create_get = asyncHandler(async (req, res, next) => {
res.send("NOT IMPLEMENTED: Genre create GET");
});

// Handle Genre create on POST.
export const genre_create_post = asyncHandler(async (req, res, next) => {
res.send("NOT IMPLEMENTED: Genre create POST");
});

// Display Genre delete form on GET.
export const genre_delete_get = asyncHandler(async (req, res, next) => {
res.send("NOT IMPLEMENTED: Genre delete GET");
});

// Handle Genre delete on POST.
export const genre_delete_post = asyncHandler(async (req, res, next) => {
res.send("NOT IMPLEMENTED: Genre delete POST");
});

// Display Genre update form on GET.
export const genre_update_get = asyncHandler(async (req, res, next) => {
res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle Genre update on POST.
export const genre_update_post = asyncHandler(async (req, res, next) => {
res.send("NOT IMPLEMENTED: Genre update POST");
});