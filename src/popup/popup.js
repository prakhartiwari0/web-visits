import './popup.css'


const addVisitButton = document.querySelector('.addVisitButton')

const addVisitModal = document.querySelector('.addVisitModal')



addVisitButton.addEventListener('click', addVisitToStorage)

function addVisitToStorage() {
    (async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, { action: "modalToggle" });
    })();

    // // Query the active tab
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    //     // tabs is an array of tab objects matching the query
    //     if (tabs.length > 0) {
    //         const currentTab = tabs[0];
    //         const tabUrl = currentTab.url;
    //         const tabID = currentTab.id;


    //     }
    // });


}