$(document).ready(() => {
  const changePage = () => {
    let page = location.hash.slice(1);
    
    if (page === "") page = "add";
    
    $("#content").load(page + ".html", () => {
      $.getScript("/js/script.js");
    });
  };
  
  window.onhashchange = changePage;
  changePage();
});