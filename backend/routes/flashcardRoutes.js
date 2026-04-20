const express = require('express');
const router = express.Router();
const { getFlashcards, createFlashcard, deleteFlashcard } = require('../controllers/flashcardController');

router.route('/:userId').get(getFlashcards);
router.route('/manual').post(createFlashcard);
router.route('/:id').delete(deleteFlashcard);

module.exports = router;
