import { readFile } from 'node:fs';
import { extractRawText } from 'mammoth';

const docxContainer = document.getElementById('docx-container');

// Replace 'path/to/your/docx/file.docx' with the path to your docx file
const docxFilePath = './test.docx';

readFile(docxFilePath, 'utf8', (err, data) => {
  if (err) throw err;

  extractRawText({ arrayBuffer: data })
    .then((result) => {
      docxContainer.innerHTML = result.value;
    })
    .catch((error) => {
      console.error(error);
    });
});