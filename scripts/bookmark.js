document.addEventListener('DOMContentLoaded', function () {
    const collapsibleItems = document.querySelectorAll('.collapsible-item');
  
    collapsibleItems.forEach(item => {
      const header = item.querySelector('.item-header');
      const subList = item.querySelector('.sub-list');
    
      header.addEventListener('click', function () {
        console.log("click!")
        subList.style.display = subList.style.display === 'none' ? 'block' : 'none';
      });
    });
  });
  