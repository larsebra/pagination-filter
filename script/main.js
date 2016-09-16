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
var fadeDuration = 1000; //fade effect duration

/**
 * Inits the application and does DOM manipulation after the document is ready
 */
function init(){
    //Init slick and add students
    $('.student-list').detach(); // Remove the list from the DOM, reference to the studentlist are saved in students
    //Add slider
    makePagination(students, stdsPrPg);
    //Add search field to DOM.
    var divSearch= $('<div></div>').addClass("student-search");
    divSearch.append(searchField)
    .append(searchBtn);
    $('.page-header').append(divSearch);
    //Attach handler to events on inputfield and search button.
    searchBtn.on('click', searchBtnHandler);
    searchField.on('keyup', keyUpHandler);
}

/** Function: makePagination
 *  Info: Makes pagination and slides from the given list. and appends it to the div page element.
 *  Param: elements, the DOM elements that should be used to make the pagination
 *         elPrSlide, number of elemens pr slides. Used to calculate pagination controls and list-items pr page.
 *  Return: void
 */
function makePagination(elements, elPrSlide){
    //If Slider is not present, Add slider to DOM
    $('.pagination').remove();
    $('ul.student-list').remove();
    var pagination = $('<div></div>').addClass('pagination');
    var nrOfSlides = Math.ceil(elements.length / elPrSlide);
    var paginationList = $('<ul></ul>')
    var listPages = [];
    for(var i = 0; i < nrOfSlides; i++){
        //add list elements
        var studentList = $('<ul></ul>').addClass('student-list').attr('id',(i+1));;
        var start = i * elPrSlide;
        var end = start + elPrSlide;
        end = (end > elements.length) ? elements.length : end;
        var slice = elements.slice(start,end);
        studentList.append(slice);
        listPages.push(studentList);
        if(i === 0)
            studentList.addClass("active");
        else
            studentList.css('display','none');
        //add pagination
        if(nrOfSlides === 1) continue;
        var a = $('<a href="#pagination">' + (i + 1) + '</a>');
        if(i === 0)
            a.addClass('active');

        a.on('click',paginationHandler);
        var li = $('<li></li>').append(a);
        paginationList.append(li);
    }
    pagination.append(paginationList).append('<a name="pagination"></a>');
    $('.page').append(listPages).append(pagination);

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
    makePagination(res, stdsPrPg);
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

/** Function: paginationHandler
 *  Info: Handler for the pagination controls. Fades out the current page and fades in the new page.
 *  Param: void
 *  Return: void
 */
function paginationHandler(event){
    $("div.pagination li a.active").removeClass('active');
    $(this).addClass('active');
    var currentPage = $("ul.student-list.active");
    var newPage = $("div.page > ul[id="+ $(this).text() +"]");
    //Fade out current page
    currentPage.fadeTo(fadeDuration/2, 0, function(){
        currentPage.toggleClass('active').css('display', 'none');
        newPage.toggleClass('active').css("opacity","0").css('display','block');
        newPage.fadeTo(fadeDuration/2, 1,function(){

        });
    });   
}

/* Init after all grapics and DOM elents are finished rendering and loading, show the ten first students */
document.addEventListener('DOMContentLoaded', function (){
    init();
});

