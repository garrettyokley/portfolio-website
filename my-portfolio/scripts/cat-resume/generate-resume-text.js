const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const cleanText = (text) => {
  return text
    // Remove non-printable characters but keep newlines, tabs, and normal spaces
    .replace(/[^\x20-\x7E\n\r\t]/g, '')
    // Remove multiple consecutive spaces
    .replace(/ +/g, ' ')
    // Remove empty lines (lines with only whitespace)
    .split('\n')
    .filter(line => line.trim().length > 0)
    .join('\n')
    // Remove leading/trailing whitespace from each line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Remove any trailing whitespace at the end of the entire text
    .trim();
};

const generateResumeText = () => {
  return new Promise((resolve, reject) => {
    const pdfPath = path.join(__dirname, '..', '..', 'public', 'Garrett Yokley.pdf');
    const outputPath = path.join(__dirname, '..', '..', 'public', 'Garrett Yokley.txt');
    
    console.log('Extracting text from PDF using Node.js...');
    console.log(`PDF: ${pdfPath}`);
    console.log(`Output: ${outputPath}`);
    
    // Check if PDF exists
    if (!fs.existsSync(pdfPath)) {
      reject(new Error(`PDF file not found: ${pdfPath}`));
      return;
    }
    
    // Clean up any existing text file first to avoid conflicts
    try {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
        console.log('Removed existing text file');
      }
    } catch (error) {
      console.warn('Could not remove existing text file:', error.message);
    }
    
    // Read PDF file as buffer
    fs.readFile(pdfPath, (err, dataBuffer) => {
      if (err) {
        reject(new Error(`Failed to read PDF file: ${err.message}`));
        return;
      }
      
      // Parse PDF using pdf-parse
      pdf(dataBuffer)
        .then((data) => {
          try {
            console.log('Cleaning extracted text...');
            
            // Clean the extracted text
            const cleanedText = cleanText(data.text);
            
            // Write the cleaned text to file
            fs.writeFileSync(outputPath, cleanedText, 'utf8');
            
            const stats = fs.statSync(outputPath);
            console.log('Resume text extracted and cleaned successfully');
            console.log(`Final file size: ${stats.size} bytes`);
            console.log(`Extracted ${data.numpages} pages`);
            console.log('Removed unknown characters and empty lines');
            resolve();
          } catch (cleanError) {
            reject(new Error(`Failed to clean and save text: ${cleanError.message}`));
          }
        })
        .catch((parseError) => {
          reject(new Error(`Failed to parse PDF: ${parseError.message}`));
        });
    });
  });
};

// Run if called directly
if (require.main === module) {
  generateResumeText()
    .then(() => {
      console.log('Resume text generation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}

module.exports = generateResumeText; 