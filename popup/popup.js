
//creates constant variables that hold the html elements for the button and error output, respectively
const cutButton = document.getElementById("cutButton");
const output = document.getElementById("para");

//instantiates and stores the url of the tab which the popup is running on
let currentUrl;
browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
  currentUrl = tabs[0].url;
});


//whenever the cutButton button is clicked, it runs copyCard function
cutButton.addEventListener("click", (event) =>  {
    createCard();
})

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
    //creates a blank string that will hold the cites portion of the card
    let cites = '';
    //gets the values of the html elements and stores them
    let author = document.getElementById("author").value;
    let title = document.getElementById("title").value;
    let tag = document.getElementById("tag").value;
    let date = document.getElementById("date").value;

    //creates a date and formats it
    var currentDate = new Date();
    var formattedDate = formatDate(currentDate);


    //concatenates information into the cite in the following format:
    // Name (Date) "Title", url. Accessed on Date2. Tag
    cites += author + " (" + date + ") \"" + title + "\", " + currentUrl + ". Accessed on " + formattedDate + 
            ". " + tag;
    
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
        wait(5000);
        cutButton.textContent = "Cut";
    }, function(err) {
        cutButton.textContent = "fail";
        wait(1000);
        cutButton.textContent = "Cut";
    });

}

//formats the date into Month DD, YYYY
function formatDate(date)  {
    var options = { month: 'long', day: 'numeric', year: 'numeric' };
    var formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}





