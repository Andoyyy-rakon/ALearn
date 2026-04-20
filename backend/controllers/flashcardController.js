const Flashcard = require('../models/Flashcard');


const getFlashcards = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const flashcards = await Flashcard.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(flashcards);
    } catch (error) {
        next(error);
    }
};


const createFlashcard = async (req, res, next) => {
    try {
        const { userId, question, answer, difficulty, topic } = req.body;

        if (!userId || !question || !answer) {
            res.status(400);
            throw new Error('Please add all required fields');
        }

        const flashcard = await Flashcard.create({
            userId,
            question,
            answer,
            difficulty: difficulty || 'medium',
            topic: topic || 'General',
            source: 'manual'
        });

        res.status(201).json(flashcard);
    } catch (error) {
        next(error);
    }
};


const deleteFlashcard = async (req, res, next) => {
    try {
        const flashcard = await Flashcard.findById(req.params.id);

        if (!flashcard) {
            res.status(404);
            throw new Error('Flashcard not found');
        }

        await flashcard.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFlashcards,
    createFlashcard,
    deleteFlashcard
};
