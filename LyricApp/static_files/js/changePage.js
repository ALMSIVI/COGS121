$(document).ready(() => {
  const changePage = () => {
    let page = location.hash.slice(1);
    
    if (page === "") page = "add";
    
    $("#content").load(page + ".html");
  };
  
  window.onhashchange = changePage;
  changePage();
});