/**
 * Global variables
 */
var students = $('.student-item'); //Save reference to student list
var searchField = $('<input>').attr("placeholder","search for students");
var searchBtn = $('<button></button>').text("search");

/**
 * Settings variables
 */
var stdsPrPg = 10; //students per page e.g listings per page.
var slickSettings = {
    dots: true,
    dotsClass: "customDots",
    fade: false,
    speed: 500,
    arrows: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    variableWidth: false,
    swipeToSlide: false,
    draggable: false,
    infinite: false
};

/**
 * Inits the application and does DOM manipulation after the document is ready
 */
function init(){
    //Init slick and add students
    $('.student-list').detach(); // Remove the list from the DOM, reference to the studentlist are saved in students
    $('.page').append(makeSlickSlider(students, stdsPrPg)); //Make a slickContainer with students, 10 listings per slide
    //Add search field to DOM.
    var divSearch= $('<div></div>').addClass("student-search");
    divSearch.append(searchField)
    .append(searchBtn);
    $('.page-header').append(divSearch);
    //Attach handler to events on inputfield and search button.
    searchBtn.on('click', searchBtnHandler);
    searchField.on('keyup', keyUpHandler);
}

/** Function: makeSlickSlider
 *  Info: Makes or Updates the slick carousell. Creates 
 *  Param: elements, the elements to be added to the slides.
 *         elPrslide, decides how many element listings per slide.
 *  Return: slickContainer with classname slickContainer
 */
function makeSlickSlider(elements, elPrSlide){
    var slickContainer = $(".slickContainer");
    if(slickContainer.length === 0){
        slickContainer = $("<div></div>").addClass("slickContainer");
        slickContainer.slick(slickSettings);
    }
    else{
        slickContainer.slick('removeSlide', null, null, true);
    }

    var pages = Math.ceil(elements.length / elPrSlide);//total pages, this gets automatically calculated based on stdsPrPg

    for(var i = 0; i<pages; i++){
        var start = i*stdsPrPg;
        var end = start + stdsPrPg;
        end = (end > elements.length)? elements.length : end;
        var div = $('<div></div>');
        var ul = $('<ul></ul>');
        div.append(ul);
        ul.append(elements.slice(start,end)); //Using slice. Slice does not alter the Original array, just returning a shallow copy(reference copy) array, thus the original array can be reused.
        slickContainer.slick('slickAdd',div);
    }
    return slickContainer;
}

/** Function: search
 *  Info: Searches through the studentlist DOM-tree for a string given in in the searchinput.
 *  Param: void
 *  Return: void
 */
function search(){
    regExStr = '' + searchField.val().toLowerCase();
    var regex = new RegExp(regExStr);
    var res = [];
    students.each((index, student)=>{
       var name = $(student).find("h3").text();
       if(regex.test(name)){
           res.push($(student));
       }
    });
    if(res.length === 0){
        res.push($('<li><h1>No Result<h1></li>'));
    }else{
        res.sort((a,b)=>{
            a = $(a).find('h3').text();
            b = $(b).find('h3').text();
            var regex = new RegExp("^" + regExStr);//Begins with search string, let it come higher up on list
            if(regex.test(a) && regex.test(b)){
                if(a <= b){
                    return -1;
                }
                else
                    return 1; 
            }
            else if(regex.test(a)){
                return -1;
            }
            else if(regex.test(b)){
                return 1;
            }
            else if(a <= b){
                return -1;
            }
            else
                return 1;
        });
    }
    makeSlickSlider(res, stdsPrPg);//Rerender slickslider with new elements
}

/** Function: searchBtnHandler
 *  Info: Handler for the search button. It calls search() if the search input contains a non-empty string.
 *  Param: void
 *  Return: void
 */
function searchBtnHandler(){
    if(searchField.val() === '')
        return;
    search();
}

/** Function: search
 *  Info: Handler for the search input keypu event. It calls search after 600 ms inactivity from the the user key input.
 *        The timer gets reseted after each key-up-event.
 *  Param: void
 *  Return: void
 */
var timer = null;
function keyUpHandler(){
    if(timer != null){
        clearTimeout(timer);
    }
    timer = setTimeout(search, 600);
}

/* Init the app when all grapics and document is done rendering and loading. */
/*$('document').ready(()=>{
    
  console.log("document ready");
});*/

/* Init after all grapics and DOM elents are finished rendering and loading */
document.addEventListener('DOMContentLoaded', ()=>{
    init();
    console.log("loading")
});

