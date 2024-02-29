//Create a new server side route for comments
// Create a new express router
const express = require('express');
const router = express.Router();
// Import the Comment model
const Comment = require('../models/comment');
// Import the authentication middleware
const passport = require('passport');
// Import the User model
const User = require('../models/user');
// Import the Post model
const Post = require('../models/post');

// POST /comments
// Purpose: Create a new comment
// Request: JSON object with the comment content and the ID of the post
// Response: JSON object with the new comment
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Create a new comment
    const newComment = new Comment({
        content: req.body.content,
        user: req.user.id,
        post: req.body.post
    });
    // Save the comment to the database
    newComment.save().then(comment => {
        // Send the new comment as a JSON object
        res.json(comment);
    }).catch(err => {
        // If there was an error saving the comment, send a 400 response with the error
        res.status(400).json(err);
    });
});

// GET /comments/:id
// Purpose: Get all comments for a post
// Request: ID of the post
// Response: JSON object with all the comments for the post
router.get('/:id', (req, res) => {
    // Find all comments for the post
    Comment.find({ post: req.params.id }).populate('user').then(comments => {
        // Send the comments as a JSON object
        res.json(comments);
    }).catch(err => {
        // If there was an error finding the comments, send a 400 response with the error
        res.status(400).json(err);
    });
});

// DELETE /comments/:id
// Purpose: Delete a comment
// Request: ID of the comment
// Response: JSON object with the deleted comment
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Find the comment by ID
    Comment.findById(req.params.id).then(comment => {
        // If the comment does not exist, send a 404 response
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        // If the comment was created by a different user, send a 403 response
        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        // Delete the comment
        comment.remove().then(() => {
            // Send the deleted comment as a JSON object
            res.json(comment);
        }).catch(err => {
            // If there was an error deleting the comment, send a 400 response with the error
            res.status(400).json(err);
        });
    }).catch(err => {
        // If there was an error finding the comment, send a 400 response with the error
        res.status(400).json(err);
    });
});

// Export the router
module.exports = router;
