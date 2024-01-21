// extract.js

function extractText() {
    var textarea = document.getElementById("input-text");
    var textContent = textarea.value;
    console.log(textContent);
    const response = window.text_input.get_text(textContent)
    console.log(response) 
  }