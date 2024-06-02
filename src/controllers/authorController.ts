import Author from '../models/author.js';
import Book from '../models/book.js';
import asyncHandler from 'express-async-handler';

export const author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await Author.findAll();
    res.render("author_list", {
        title: "Author List",
        author_list: allAuthors
    });

});

export const author_detail = asyncHandler(async (req, res, next) => {
    const authorProm = Author.findByPk(req.params.id);
    const bookProm = Book.findAll({
        where: {
            AuthorId: req.params.id,
        }
    });

    const [authorRes, bookRes] = await Promise.all([authorProm, bookProm]);
    
    res.render("author_detail", {
        author: authorRes,
        author_books: bookRes
    });
});

export const author_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author create GET");
});

export const author_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author create POST");
  });
  
// Display Author delete form on GET.
export const author_delete_get = asyncHandler(async (req, res, next) => {
res.send("NOT IMPLEMENTED: Author delete GET");
});

// Handle Author delete on POST.
export const author_delete_post = asyncHandler(async (req, res, next) => {
res.send("NOT IMPLEMENTED: Author delete POST");
});

// Display Author update form on GET.
export const author_update_get = asyncHandler(async (req, res, next) => {
res.send("NOT IMPLEMENTED: Author update GET");
});

// Handle Author update on POST.
export const author_update_post = asyncHandler(async (req, res, next) => {
res.send("NOT IMPLEMENTED: Author update POST");
});