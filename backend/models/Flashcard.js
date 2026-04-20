const mongoose = require('mongoose');

const flashcardSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
           
        },
        question: {
            type: String,
            required: [true, 'Question is required']
        },
        answer: {
            type: String,
            required: [true, 'Answer is required']
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        },
        topic: {
            type: String,
            default: 'General'
        },
        source: {
            type: String,
            enum: ['manual', 'ai', 'pdf'],
            required: true
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Flashcard', flashcardSchema);
