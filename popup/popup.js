
//creates constant variables that hold the html elements for the button and error output, respectively
const cutButton = document.getElementById("cutButton");
const output = document.getElementById("para");

//creates constant variables that hold the html elements for the input boxes
const authorInput = document.getElementById("author");
const dateInput = document.getElementById("date");
const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const tagInput = document.getElementById("tag");

//instantiates and stores the url of the tab which the popup is running on
let currentUrl;
let author = "";
let date = "";
var title = ""; 
let tag = "";
//querys for the active tab 
browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
    // stores the tab
    var currentTab = tabs[0];
    // stores the URL of the active tab
    currentUrl = tabs[0].url;
    // changes the value of the URL input the match the current URL
    urlInput.value = currentUrl;
});


// sends a message to content script whenever the popup is opened
browser.tabs.query({active: true, currentWindow: true}).then(function(tabs) {

    // Send a message to the content script to retrieve the page title
    browser.tabs.sendMessage(tabs[0].id, {action: "getTitle"}).then(function(response) {
        // Update the title input in the popup with the retrieved page title
        title = response.value;

        titleInput.value = title;
        console.log(title);
    });
    browser.tabs.sendMessage(tabs[0].id, {action: "getAuthor"}).then(function(response) {
        // Update the author input 
        author = response.value;
        authorInput.value = author;
        console.log(author);
    });
    browser.tabs.sendMessage(tabs[0].id, {action: "getDate"}).then(function(response) {
        // Update the date input 
        date = response.value;
        dateInput.value = date;
        console.log(date);
    });
});

//fills in any of the input slots with any information found 
authorInput.value = author;
dateInput.value = date;
titleInput.value = title;
urlInput.value = currentUrl;

//whenever the cutButton button is clicked, it runs copyCard function
cutButton.addEventListener("click", (event) =>  {
    console.log("clicked");
    createCard();
});


//stops scrolling from closing the window
document.addEventListener('scroll', function(event) {
    event.preventDefault();
});


//fortnite 
//returns string of whatever's highlighted
function getSelectedText() {
    //gets the active tab and returns the currentlyl highlighted text
    return browser.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
        return browser.tabs.executeScript(tabs[0].id, { code: "window.getSelection().toString();" });
    }).then(function(result) {
        return result[0];
    });
}

//generates then copies the card to the clipboard
function createCard() {
    
    let cites = '';
    //gets the values of the html elements and stores them
    author = authorInput.value
    date = dateInput.value;
    title = titleInput.value;
    tag = tagInput.value;
    currentUrl = urlInput.value;
    //creates a date and formats it
    var currentDate = new Date();
    var formattedDate = formatDate(currentDate);


    //concatenates information into the cite in the following format:
    // Name (Date) "Title", url. Accessed on Date2. Tag
    cites += author + " (" + date + ") \"" + title + "\", " + currentUrl + ". Accessed on " + formattedDate + 
            ". //" + tag;
    
    //consolidates the cites and the evidence under a card
    let card = ""; 

    //puts the evidence and card together
    getSelectedText().then(function(highlightedText) {
        card += cites + "\n" + highlightedText; //adds the cite to the evidence

        document.getElementById("para").textContent = card;

        copyCard(card);
    });
}

function copyCard(card) {
    //copies card to clipboard; temporarily changes button's text if it works/fails
    navigator.clipboard.writeText(card).then(function() {
        cutButton.textContent = "success";
    }, function(err) {
        cutButton.textContent = "fail";
    });

}

//formats the date into Month DD, YYYY
function formatDate(date)  {
    var options = { month: 'long', day: 'numeric', year: 'numeric' };
    var formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}



/*
//tries to automatically get the author's name via metadata
// if it doesn't work, it just goes back to what the old name was
function getAuthor(currentTab)    {

    if (!currentTab) {
        console.error("currentTab is not defined");
        return Promise.reject(new Error("currentTab is not defined"));
    }

    const defaultAuthor = "Balls";


    // Try to get the author from a meta tag
    const metaCode = 'document.querySelector("meta[name=\'author\']").getAttribute("content")';
    const metaPromise = browser.tabs.executeScript(currentTab.id, { code: metaCode })
        .then(result => result[0])
        .catch(error => console.error(error));

    // Try to get the author from the Open Graph protocol
    const ogCode = 'document.querySelector("meta[property=\'og:article:author\']").getAttribute("content")';
    const ogPromise = browser.tabs.executeScript(currentTab.id, { code: ogCode })
        .then(result => result[0])
        .catch(error => console.error(error));

    // Try to get the author from the article element
    const articleCode = 'document.querySelector("article [itemprop=\'author\']")';
    const articlePromise = browser.tabs.executeScript(currentTab.id, { code: articleCode })
        .then(result => result[0].textContent.trim())
        .catch(error => console.error(error));

    // Wait for all promises to resolve and get the first successful result
    Promise.all([metaPromise, ogPromise, articlePromise])
        .then(results => {
        const foundAuthor = results.find(result => result != null && result != "");
        return foundAuthor || defaultAuthor; // or do something else with the author
        })
        .catch(error => {
            console.error(error);
            return defaultAuthor;
        });
}*/






