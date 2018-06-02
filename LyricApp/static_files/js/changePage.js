$(() => {
  const changePage = () => {
    let page = location.hash.slice(1);
    
    if (page === "") page = "add";
    
    $("#content").load(page + ".html");

    if(page === "game"){
    	document.body.style.background = "black";
    }
    else{
    	document.body.style.background = "white";
    }
  };
  
  window.onhashchange = changePage;
  changePage();
});