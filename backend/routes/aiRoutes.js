const express = require('express');
const router = express.Router();
const multer = require('multer');
const { generateFromTopic, generateFromPDF, explainAnswer, generateQuiz } = require('../controllers/aiController');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/topic', generateFromTopic);
router.post('/pdf', upload.single('pdf'), generateFromPDF);
router.post('/explain', explainAnswer);
router.post('/quiz', generateQuiz);

module.exports = router;
