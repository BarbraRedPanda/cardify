// Get the save button element
var saveButton = document.getElementById('save-button');

// Add an event listener for the save button
saveButton.addEventListener('click', function() {
    // Get the value of the tag input
    var tag = document.getElementById('tag-input').value;
    var calendar = document.getElementById('calendar-input').value;

    // Save the value of the input field using browser.storage API
    browser.storage.local.set({tag, calendar});

    saveButton.textContent = "Tag saved successfully!";
});