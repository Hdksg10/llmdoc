let bookmarks = []
function findItemInBookmarks(name, callback){
  let bm;
  bookmarks.forEach(bookmark => {
    if (bookmark.name === name) {
      bm = bookmark;
      return;
    }
  });
  callback(bm);
}

function addDoubleClickListener(item) {
  let name = item.innerText;
  item.addEventListener('dblclick', function (){
    console.log(name);
    findItemInBookmarks(name, (bookmark) => {
      const path = bookmark.path;
      console.log(path);
      const response = window.bookmark.load_bookmark(path)
      response.then((value) => {
        console.log(value)
        code = value.code;
        window.bookmark.edit_bookmark(path, {"name": name, "code": code});
      });
    });

  });
  item.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    console.log("context menu!");
    console.log(name);
    findItemInBookmarks(name, (bookmark) => {
      const path = bookmark.path;
      const response = window.bookmark.load_bookmark(path)
      response.then((value) => {
        console.log(value)
        code = value.code;
        window.bookmark.bookmark_menu(value);;
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  let bmlist = document.getElementById("bookmark-list");
  const response = window.bookmark.load_all_bookmarks()
  response.then((value) => {
    console.log(value)
    value.forEach(bookmark => {
      bookmarks.push(bookmark);
      let bm = document.createElement("li", {"id": bookmark.name});
      bm.innerHTML = bookmark.name;
      let item = bmlist.appendChild(bm);
      addDoubleClickListener(item);
      console.log(bookmark.name);
    });
  })
  window.bookmark.reload_all_bookmarks((new_bookmarks) => {
    bookmarks = new_bookmarks;
    console.log("reload bookmarks");
    console.log(new_bookmarks);
    bmlist.innerHTML = "";
    new_bookmarks.forEach(bookmark => {
      let bm = document.createElement("li", {"id": bookmark.name});
      bm.innerHTML = bookmark.name;
      let item = bmlist.appendChild(bm);
      addDoubleClickListener(item);
      console.log(bookmark.name);
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const collapsibleItems = document.querySelectorAll('.collapsible-item');

  collapsibleItems.forEach(item => {
    const header = item.querySelector('.item-header');
    const subList = item.querySelector('.sub-list');
  
    header.addEventListener('click', function () {
      console.log("click!");
      const isNotShow = subList.style.display !== 'block';
      const icon = header.querySelector('.icon');
      icon.style.transform = isNotShow ? 'rotate(90deg)' : 'rotate(0deg)'; 
      if (isNotShow) {
        subList.style.display = 'block';
        subList.style.height = 'auto';
        const height = subList.clientHeight + 'px';
        subList.style.height = '0px';
        setTimeout(() => {
          subList.style.height = height;
        }, 0);
      } else {
        subList.style.height = '0px'
        subList.addEventListener('transitionend', function () {
          subList.style.display = 'none';
        }, {
          once: true
        });
      }
    });
  });
});
