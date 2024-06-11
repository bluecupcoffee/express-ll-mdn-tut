import Book from "../models/book.js";
import BookInstance from "../models/bookinstance.js";
import asyncHandler from "express-async-handler";
import {body , validationResult } from 'express-validator';
import HttpError from '../models/HttpError.js';


// Display list of all BookInstances.
export const bookinstance_list = asyncHandler(async (req, res, next) => {
    const bookInstanceList = await BookInstance.findAll({
      include: Book
    });
    res.render("bookinstance_list", {
      title: "Book Instance List",
      bookinstance_list: bookInstanceList
    });
  });
  
// Display detail page for a specific BookInstance.
export const bookinstance_detail = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findByPk(req.params.id, {
    include: Book
  });
  
  res.render("bookinstance_detail", {
    bookinstance: bookInstance
  });
});

// Display BookInstance create form on GET.
export const bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const bookList = await Book.findAll();
  res.render("bookinstance_form", {
    title: "Create book instance",
    book_list: bookList
  });
});

// Handle BookInstance create on POST.
export const bookinstance_create_post = [
  body("book", "Book must be specified")
    .trim()
    .isLength({min: 1})
    .escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({min: 1})
    .escape(),
  body("due_back", "Invalid date")
    .optional({values: "falsy"})
    .isISO8601()
    .toDate(),
  body("status")
    .escape(),

  asyncHandler(async (req, res, next) =>{
    const errors = validationResult(res);
    const book = await Book.findByPk(req.body.book);
    if(book===null) {
      throw new HttpError(404, "Book not found");
      return;
    }

    const bookInstance = new BookInstance({
      BookId: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });

    if(!errors.isEmpty()) {
      const bookList = await Book.findAll();

      res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: bookList,
        selected_book: bookInstance.get('BookId'),
        errors: errors.array(),
        bookinstance: bookInstance
      });
      return;
    } else {
      await bookInstance.save();
      res.redirect(bookInstance.get('url') as string);
    }
  })
]

// Display BookInstance delete form on GET.
export const bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findByPk(req.params.id);
  res.render("bookinstance_delete", {
    title: "Delete BookInstance",
    bookinstance: bookInstance
  });
});

// Handle BookInstance delete on POST.
export const bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findByPk(req.params.id);
  if(bookInstance===null) {
    throw new HttpError(404, "BookInstance not found");
    return;
  } else {
    await BookInstance.destroy();
    res.redirect("/catalog/bookinstances");
  }
});

// Display BookInstance update form on GET.
export const bookinstance_update_get = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findByPk(req.params.id);
  const bookList = await Book.findAll();
  if(bookInstance===null) {
    throw new HttpError(404, "BookInstance not found");
    return;
  }
  res.render("bookinstance_form", {
    title: "Update BookInstance",
    bookinstance: bookInstance,
    book_list: bookList,
    selected_book: bookInstance.get('BookId')
  });
});

// Handle bookinstance update on POST.
export const bookinstance_update_post = [
  body("book", "Book must be specified")
    .trim()
    .isLength({min: 1})
    .escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({min:1})
    .escape(),
  body("due_back", "Invalid date")
    .optional({values: "falsy"})
    .isISO8601()
    .toDate(),
  body("status")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const bookInstance = await BookInstance.findByPk(req.params.id);
    const bookList = await Book.findAll();
    const errors = validationResult(res);
    if(!errors.isEmpty()){
      res.render("bookinstance_form", {
        title: "Update BookInstance",
        book_list: bookList,
        selected_book: req.body.book,
        status: req.body.status
      });
    }
    if(bookInstance===null) {
      throw new HttpError(404, "BookInstance not found");
      return;
    } else {
      bookInstance.set({
        BookId: req.body.book,
        imprint: req.body.imprint,
        due_back: req.body.due_back,
        status: req.body.status
      });

      await bookInstance.save();
      res.redirect(bookInstance.get('url') as string);
    }
  })
]