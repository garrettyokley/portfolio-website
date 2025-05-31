const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

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
    const pdfPath = path.join(__dirname, '..', 'public', 'Garrett Yokley.pdf');
    const outputPath = path.join(__dirname, '..', 'public', 'Garrett Yokley.txt');
    
    // Determine the correct pdftotext command based on platform
    let pdfToTextCommand;
    if (process.platform === 'win32') {
      // Windows - use the .exe from bin folder
      pdfToTextCommand = path.join(__dirname, 'bin', 'pdftotext.exe');
    } else {
      // Linux/Unix - look for Linux binary in bin folder
      pdfToTextCommand = path.join(__dirname, 'bin', 'pdftotext');
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

    console.log('Extracting text from PDF...');
    console.log(`PDF: ${pdfPath}`);
    console.log(`Output: ${outputPath}`);
    console.log(`Using: ${pdfToTextCommand}`);
    
    // Check if PDF exists
    if (!fs.existsSync(pdfPath)) {
      reject(new Error(`PDF file not found: ${pdfPath}`));
      return;
    }
    
    // Check if pdftotext command exists
    if (!fs.existsSync(pdfToTextCommand)) {
      reject(new Error(`pdftotext binary not found: ${pdfToTextCommand}`));
      return;
    }
    
    // Run pdftotext command
    const pdftotext = spawn(pdfToTextCommand, [pdfPath, outputPath], {
      cwd: __dirname
    });
    
    let stdout = '';
    let stderr = '';
    
    pdftotext.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pdftotext.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pdftotext.on('close', (code) => {
      if (code === 0) {
        // Verify the output file was created
        if (fs.existsSync(outputPath)) {
          try {
            // Read the generated text file
            const rawText = fs.readFileSync(outputPath, 'utf8');
            console.log('Cleaning extracted text...');
            
            // Clean the text
            const cleanedText = cleanText(rawText);
            
            // Write the cleaned text back to the file
            fs.writeFileSync(outputPath, cleanedText, 'utf8');
            
            const stats = fs.statSync(outputPath);
            console.log('Resume text extracted and cleaned successfully');
            console.log(`Final file size: ${stats.size} bytes`);
            console.log('Removed unknown characters and empty lines');
            resolve();
          } catch (cleanError) {
            reject(new Error(`Failed to clean text: ${cleanError.message}`));
          }
        } else {
          reject(new Error('Output file was not created'));
        }
      } else {
        console.error('pdftotext failed');
        reject(new Error(`pdftotext exited with code ${code}: ${stderr}`));
      }
    });
    
    pdftotext.on('error', (error) => {
      console.error('Failed to start pdftotext process:', error.message);
      reject(error);
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