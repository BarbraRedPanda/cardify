//tries to automatically get the author's name via metadata
// if it doesn't work, it just goes back to what the old name was

/*function getAuthor() {
  const metaAuthor = document.querySelector('meta[name="author"]');
  if (metaAuthor) {
    const authorName = metaAuthor.getAttribute('content');
    if (authorName) {
      return authorName.trim();
    }
  }

  const authorElements = document.querySelectorAll('.author, .byline');
  if (authorElements.length > 0) {
    const authorName = authorElements[0].textContent.trim();
    if (authorName) {
      return authorName;
    }
  }

  return "joe";
}*/

//sends article title to background script
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "getTitle") {
    const pageTitle = getTitle();
    console.log(pageTitle);
    sendResponse({value: pageTitle});
  } else if (message.action === "getAuthor")  {
    sendResponse({value: getAuthor()});
  } else if (message.action === "getDate")  {
    sendResponse({value: getDate()});
  }
});


function getTitle()  {
  const metaElement = window.document.querySelector("meta[property*='title']");
  const title = metaElement.getAttribute('content');
  return title;
}

function getAuthor()  {
  const author = window.document.querySelector("meta[name*='author']").getAttribute('content');
  if(author) return author; // tests to see if there is an author
  // if the first method didn't work, looks through a differnt way of storing author (ie for NYT)
  author = window.document.querySelector("meta[name*='byl']").getAttribute('content');
  return author;
}

function getDate()  {
  const rawDate = window.document.querySelector("meta[property*='time']").getAttribute('content').substring(0,10);
  //const unix_timestamp = Date.parse(rawDate);
  var date = new Date(rawDate);
  return date.toDateString();
}