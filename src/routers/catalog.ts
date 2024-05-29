import express from "express";
const router = express.Router();

import * as BookController from "../controllers/bookController.js";
import * as AuthorController from "../controllers/authorController.js";
import * as GenreController from "../controllers/genreController.js";
import * as BookInstanceController from "../controllers/bookInstanceController.js";


//Book routes

// GET catalog home page
router.get("/", BookController.index);

// GET req for creating a book. must come before routes that display a book
router. get("/book/create", BookController.book_create_post);

// POST req for creating book
router.post("/book/create", BookController.book_create_post);

// GET req for delete book
router.get("/book/:id/delete", BookController.book_delete_get);

// POST req for delete book
router.post("/book/:id/delete", BookController.book_delete_post);

// GET req to update book
router.get("/book/:id/update", BookController.book_update_get);

// POST req to udpate book 
router.get("/book/:id/update", BookController.book_update_post);

router.get("/book/:id", BookController.book_detail);

router.get("/books", BookController.book_list);

// Author routes
router.get("/author/create", AuthorController.author_create_get);

router.post("/author/create", AuthorController.author_create_post);

router.get("/author/:id/delete", AuthorController.author_delete_get);

router.post("/author/:id/delete", AuthorController.author_create_post);

router.get("/author/:id/update", AuthorController.author_update_get);

router.post("/author/:id/update", AuthorController.author_update_post);

router.get("/author/:id", AuthorController.author_detail);

router.get("/authors", AuthorController.author_list);

// genre routes
router.get("/genre/create", GenreController.genre_create_get);

router.post("/genre/create", GenreController.genre_create_post);

router.get("/genre/:id/delete", GenreController.genre_delete_get);

router.post("/genre/:id/delete", GenreController.genre_delete_post);

router.get("/genre/:id/update", GenreController.genre_update_get);

router.post("/genre/:id/update", GenreController.genre_update_post);

router.get("/genre/:id", GenreController.genre_detail);

router.get("/genres", GenreController.genre_list);

// bookinstance routes
router.get(
    "/bookinstance/create",
    BookInstanceController.bookinstance_create_get
);

router.post(
    "/bookinstance/create",
    BookInstanceController.bookinstance_create_post
);

router.get(
    "/bookinstance/:id/delete",
    BookInstanceController.bookinstance_delete_get
);

router.post(
    "/bookinstance/:id/delete",
    BookInstanceController.bookinstance_delete_post
);

router.get(
    "/bookinstance/:id/update",
    BookInstanceController.bookinstance_update_get
);

router.post(
    "/bookinstance/:id/update",
    BookInstanceController.bookinstance_update_post
);

router.get(
    "/bookinstance/:id",
    BookInstanceController.bookinstance_detail
);

router.get(
    "/bookinstances",
    BookInstanceController.bookinstance_list
);

export default router;