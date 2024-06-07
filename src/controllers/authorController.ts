import Author from '../models/author.js';
import Book from '../models/book.js';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import assert from 'assert';
import HttpError from "../models/HttpError.js";

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
    res.render("author_form", {
        title: "Create author"
    });
});

export const author_create_post = [
    body("first_name")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("First name must be specified")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters"),
    body("family_name")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Family name must be specified")
        .isAlphanumeric()
        .withMessage("Family name has non-alphanumeric characters"),
    body("date_of_birth", "Invalid date of birth")
        .optional({ values: "falsy"})
        .isISO8601()
        .toDate(),
    body("date_of_death")
        .optional({values: "falsy"})
        .isISO8601()
        .toDate(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        console.log(JSON.stringify(req.body, null, 2));
        const author = await Author.create({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death
        });

        if(!errors.isEmpty()) {
            res.render("author_form", {
                title: "Create author",
                author: author,
                errors: errors.array()
            });
            return;
        } else {
            await author.save();
            res.redirect(author.get('url') as string);

        }

    })

];
  
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
    const author = await Author.findByPk(req.params.id);
    assert(author!==null, "Author must not be null!");
    res.render("author_form",{
        title: "Update author",
        author: author
    });
});

// Handle Author update on POST.
export const author_update_post = [
    body("first_name")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("First name must be specified")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters"),
    body("family_name")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Family name must be specified")
        .isAlphanumeric()
        .withMessage("Family name has non-alphanumeric characters"),
    body("date_of_birth", "Invalid date of birth")
        .optional({values: "falsy"})
        .isISO8601()
        .toDate(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const author = await Author.findByPk(req.params.id);
        assert(author!==null, "Could not find author by PK");

        if(!errors.isEmpty()) {
            res.render("author_form", {
                title: "Update author",
                author: author,
                errors: errors.array()
            });
            return;
        } else {
            console.log(`AUTHOR BEFORE CHANGES#################################################\n${JSON.stringify(author, null, 2)}`);
            console.log(`REQ BODY##############################################################\n${JSON.stringify(req.body, null, 2)}`);
            try{
                await author.set({
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: (req.body.date_of_death==="" ? null : req.body.date_of_death)
                });
        
                await author.save();

            } catch(err) {
                throw new HttpError(500, (err as Error).message);
            }
            
            
            
            res.redirect(`${author.get('url')}`);
        }

    })
];