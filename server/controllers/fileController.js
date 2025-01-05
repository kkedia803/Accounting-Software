const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');
const pdf2img = require('pdf2img');
const mammoth = require('mammoth');

// Perform OCR using Tesseract.js

const performOCR = (filePath) => {
    return new Promise((resolve, reject) => {
        // Check if file is a PDF
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.pdf') {
            // Convert PDF to images
            pdf2img.convert(filePath, function (err, pages) {
                if (err) {
                    return reject(err);
                }
                // Perform OCR on the first page (you can extend this to handle multiple pages)
                Tesseract.recognize(pages[0].path, 'eng', {
                    logger: (m) => console.log(m), // Optional logging for OCR progress
                }).then(({ data: { text } }) => {
                    resolve(text); // Return the extracted text
                }).catch(reject);
            });
        } 
        // Check if file is a DOCX
        else if (ext === '.docx') {
            // Convert DOCX to HTML (then can be processed for OCR)
            mammoth.extractRawText({ path: filePath })
                .then(result => {
                    resolve(result.value); // Return the extracted text
                })
                .catch(reject);
        } 
        // Handle image file directly
        else if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
            Tesseract.recognize(filePath, 'eng', {
                logger: (m) => console.log(m), // Optional logging for OCR progress
            }).then(({ data: { text } }) => {
                resolve(text); // Return the extracted text
            }).catch(reject);
        } else {
            reject(new Error('Unsupported file format'));
        }
    });
};

// File upload and OCR processing handler
const uploadFiles = async (req, res) => {
    console.log('hi');
    try {
        console.log(req.files); // Logs the array of files uploaded
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }

        const results = []; // Array to hold results for all files
        const ocrDirectory = path.join(__dirname, '..', 'ocr');
        if (!fs.existsSync(ocrDirectory)) {
            fs.mkdirSync(ocrDirectory, { recursive: true }); // Create the directory if it doesn't exist
        }
        for (let file of files) {
            try {
                // Perform OCR on the uploaded file
                const ocrResult = await performOCR(file.path);

                // Save the extracted text in a .txt file
                const outputTextFilePath = path.join(__dirname, '..', 'ocr', `ocr_${file.filename}.txt`);
                
                fs.writeFileSync(outputTextFilePath, ocrResult);

                // Store result in an array
                results.push({
                    originalFileName: file.originalname,
                    textFilePath: `/uploads/${file.filename}.txt`
                });
            } catch (error) {
                console.error(`Error processing file ${file.filename}:`, error);
                results.push({
                    originalFileName: file.originalname,
                    error: 'Error during OCR processing'
                });
            }
        }

        // Send the results back to the client
        res.status(200).send({
            message: 'OCR completed and text files created.',
            results: results
        });
    } catch (error) {
        console.error('Error during file upload or OCR process:', error);
        res.status(500).send('Error during file upload or OCR process');
    }
};

// Export the controller functions
module.exports = { uploadFiles };
