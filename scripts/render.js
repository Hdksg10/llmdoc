// document.addEventListener('DOMContentLoaded', window.docx.open_file());
// window.docx.disply_docx_content((content) => {
//   const container = document.getElementById("docx-container");
//   console.log(content);
//   container.innerHTML = content;
// });

const loading = document.querySelector('.loading');
const mainContainer = document.querySelector('.main-container');
const openIcon = document.querySelector('.open-icon');

openIcon.addEventListener('click', () => {
  window.docx.open_file()
  // if (isOpen) {
  //   loading.style.display = 'none';
  //   mainContainer.style.display = 'block';
  // }
})

window.docx.disply_docx_content((content) => {
  const container = document.getElementById("docx-container");
  console.log(content);
  container.innerHTML = content;
  loading.style.display = 'none';
  mainContainer.style.display = 'flex';
  // require('electron').remote.getGlobal('openStatus') = true;
});