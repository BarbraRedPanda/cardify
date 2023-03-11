
//creates constant variables that hold the html elements for the button and error output, respectively
const cutButton = document.getElementById("cutButton");
const output = document.getElementById("para");
const bypassButton = document.getElementById("bypassButton");

//creates constant variables that hold the html elements for the input boxes
const authorInput = document.getElementById("author");
const dateInput = document.getElementById("date");
const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const tagInput = document.getElementById("tag");

/*
Note: 
The next few asynchronus calls will autofill the inputs.

This is easier than storing them in global variables since 
a) the functions are asyncronus
b) there's no point in global variables if they are going to be varied by the user (if that makes sense)
*/


// Get the tag value from storage and autofills it into the popup
browser.storage.local.get('tag').then(function(result) {
    tag = result.tag;
    tagInput.value = tag;
});

// Gets the URL of the active tab and autofills the popup
//queries for the active tab 
browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
    // stores the tab
    var currentTab = tabs[0];
    // stores the URL of the active tab
    var currentUrl = tabs[0].url;
    // changes the value of the URL input the match the current URL
    urlInput.value = currentUrl;
});

// Gets the title, author, and date of an article (via its metadata) and fills each into the popup
// sends a message to content script whenever the popup is opened
browser.tabs.query({active: true, currentWindow: true}).then(function(tabs) {

    // Send a message to the content script to retrieve the article title
    browser.tabs.sendMessage(tabs[0].id, {action: "getTitle"}).then(function(response) {
        // Update the title input in the popup with the retrieved article title
        title = response.value;

        titleInput.value = title;
        console.log(title);
    });
    // sends a message to retrieve the author
    browser.tabs.sendMessage(tabs[0].id, {action: "getAuthor"}).then(function(response) {
        // Update the author input 
        author = response.value;
        authorInput.value = author;
        console.log(author);
    });
    // sends a message to retrieve the date
    browser.tabs.sendMessage(tabs[0].id, {action: "getDate"}).then(function(response) {
        // Update the date input 
        date = response.value;
        dateInput.value = date;
        console.log(date);
    });
});


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
    //gets the values of the html input elements and stores them
    var author = authorInput.value
    var date = dateInput.value;
    var title = titleInput.value;
    var tag = tagInput.value;
    var url = urlInput.value;
    //creates a date and formats it
    var currentDate = new Date();
    var formattedDate = formatDate(currentDate);


    //concatenates information into the cite in the following format:
    // Name (Date) "Title", url. Accessed on Date2. Tag
    cites += author + " (" + date + ") \"" + title + "\", " + url + ". Accessed on " + formattedDate + 
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
        cutButton.textContent = "Done!";
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

//whenever the bypassButton is clicked, it changes the tab to the archive.ph equivallent
bypassButton.addEventListener("click", (event) =>  {
    browser.tabs.query({active: true, currentWindow: true}).then(function(tabs) {
        var currentTab = tabs[0];
        var oldURL = currentTab.url;
        var truncatedURL = oldURL.substring(oldURL.indexOf('w'), oldURL.length);
        console.log(truncatedURL);
        // Update the current tab's URL to the new URL
        browser.tabs.update(currentTab.id, {url: ("https://www.archive.ph/" + truncatedURL)});
    });
});
