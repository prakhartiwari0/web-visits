// background.js

chrome.runtime.onInstalled.addListener(
    chrome.contextMenus.create(
        {
            title: "Create Web Visit",
            id: "createWebVisit",
            contexts: ['page']

        }
    )
)


async function togglePopup() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { action: "modalToggle" });
}



chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId=='createWebVisit') {
        console.log("popup menu bro");
        togglePopup()
    }
    else if (info.menuItemId=='showLogsOfVisitedLink') {
        console.log("Visit Link context menu bro");
        showLogsOfVisitedLink(info.linkUrl)
    }
})

function showLogsOfVisitedLink(link) {
    console.log(link);
    
}



chrome.commands.onCommand.addListener(function (command) {
    if (command === 'openClosePopup') togglePopup()

})




// Context Menu for visitedLinks

chrome.contextMenus.create({
    id: "showLogsOfVisitedLink",
    title: "Show Visits",
    contexts: ["link"],
    enabled: false // Initially disabled
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.enableMenuItem == true || message.enableMenuItem == false) {
        chrome.contextMenus.update("showLogsOfVisitedLink", { enabled: message.enableMenuItem });
    }
});