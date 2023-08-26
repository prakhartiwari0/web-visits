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



chrome.contextMenus.onClicked.addListener(() => {
    togglePopup()
})



chrome.commands.onCommand.addListener(function (command) {
    if (command === 'openClosePopup') togglePopup()

})


