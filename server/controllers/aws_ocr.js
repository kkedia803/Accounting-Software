const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS SDK
AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
});
const textract = new AWS.Textract();

// Perform OCR using AWS Textract
const performOCR = (filePath) => {
    return new Promise((resolve, reject) => {
        const fileData = fs.readFileSync(filePath); // Read the file as binary

        const params = {
            Document: {
                Bytes: fileData, // Provide file data as binary
            },
        };

        textract.detectDocumentText(params, (err, data) => {
            if (err) {
                return reject(err);
            }

            // Combine all detected text lines into a single string
            const extractedText = data.Blocks
                .filter((block) => block.BlockType === 'LINE')
                .map((block) => block.Text)
                .join('\n');

            resolve(extractedText);
        });
    });
};

// File upload and OCR processing handler
const uploadFiles = async (req, res) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }

        const results = [];
        const ocrDirectory = path.join(__dirname, '..', 'ocr');
        if (!fs.existsSync(ocrDirectory)) {
            fs.mkdirSync(ocrDirectory, { recursive: true });
        }

        for (let file of files) {
            try {
                const ocrResult = await performOCR(file.path);

                const outputTextFilePath = path.join(
                    __dirname,
                    '..',
                    'ocr',
                    `ocr_${file.filename}.txt`
                );

                fs.writeFileSync(outputTextFilePath, ocrResult);

                results.push({
                    originalFileName: file.originalname,
                    textFilePath: `/ocr/ocr_${file.filename}.txt`,
                });
            } catch (error) {
                console.error(`Error processing file ${file.filename}:`, error);
                results.push({
                    originalFileName: file.originalname,
                    error: 'Error during OCR processing',
                });
            }
        }

        res.status(200).send({
            message: 'OCR completed and text files created.',
            results: results,
        });
    } catch (error) {
        console.error('Error during file upload or OCR process:', error);
        res.status(500).send('Error during file upload or OCR process');
    }
};

module.exports = { uploadFiles };
