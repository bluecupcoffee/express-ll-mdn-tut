import express from 'express';
import asyncHandler from 'express-async-handler';
import Book from '../models/book.js';
const router = express.Router();

router.get("/", function (req, res) {
    res.send("Wiki home page");
});

router.get("/about", function (req, res) {
    res.send("About this wiki");
});

router.get("/books/:bookId",
    asyncHandler(async (req, res, next) => {
        const successfulRes = await Book.findByPk(req.params.bookId);
        res.send(successfulRes);
    }),
);


export default router;