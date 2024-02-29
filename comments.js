//Create a new server side route to handle the new comment form submission.
//This route will be responsible for adding a new comment to the database.
//The form data will be sent as a POST request to the server.
//The server will then add the new comment to the database and return the updated list of comments.
//The updated list of comments will be sent back to the client and displayed on the page.

const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

// GET request to display the new comment form
router.get('/new', (req, res) => {
  res.render('comments/new');
});

// POST request to handle the new comment form submission
router.post(
  '/',
  // Validate and sanitize the fields
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Comment must not be empty')
    .escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('comments/new', { errors: errors.array() });
    } else {
      try {
        // Create a new comment
        const comment = new Comment({
          text: req.body.text,
          timestamp: new Date(),
          user: req.user._id,
        });
        // Save the new comment to the database
        await comment.save();
        // Add the new comment to the post
        const post = await Post.findById(req.body.postId);
        post.comments.push(comment);
        await post.save();
        // Redirect to the post detail page
        res.redirect(`/posts/${req.body.postId}`);
      } catch (err) {
        console.error(err);
        res.send('Error adding comment');
      }
    }
  }
);

module.exports = router;
