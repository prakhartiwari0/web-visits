import './popup.css'


const addVisitButton = document.querySelector('.addVisitButton')

const addVisitModal = document.querySelector('.addVisitModal')



addVisitButton.addEventListener('click', addVisitToStorage)

function addVisitToStorage() {
    (async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, { action: "modalToggle" });
    })();

}




chrome.storage.local.get(['visitsLog']).then((result) => {


    const log = result.visitsLog


    function createLogEntry(dateNow, url, messagePreview) {
        const logDiv = document.createElement("div");
        logDiv.className = "eachLogDiv";

        const dateTimeSpan = document.createElement("span");
        dateTimeSpan.className = "dateTimeSpan";
        dateTimeSpan.innerText = dateNow;

        const urlAnchor = document.createElement("a");
        urlAnchor.className = "urlAnchor";
        urlAnchor.target = '_blank';
        urlAnchor.href = url;
        urlAnchor.title = url;
        urlAnchor.textContent = urlAnchor.hostname;

        const messagePreviewSpan = document.createElement("span");
        messagePreviewSpan.className = "messagePreviewSpan";
        messagePreviewSpan.innerText = messagePreview;

        logDiv.appendChild(dateTimeSpan);
        logDiv.appendChild(urlAnchor);
        logDiv.appendChild(messagePreviewSpan);

        return logDiv;
    }


    const logsContainer = document.body.querySelector(".activeWebsiteLogContainer")

    for (let index = 0; index < log.length; index++) {


        const eachData = log[index].visitDataObject;
        let visitDateTime = new Date(parseInt(eachData.visitDateTime)).toLocaleDateString() + " " + new Date(parseInt(eachData.visitDateTime)).toLocaleTimeString()


        let visitURL = eachData.visitURL
        let visitMessage = eachData.visitMessage

        const newLogEntry = createLogEntry(visitDateTime, visitURL, visitMessage);


        // console.log(newLogEntry);


        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            const activeTabUrl = activeTab.url;

            if (visitURL==activeTabUrl) {
                logsContainer.appendChild(newLogEntry);
               
            }
            console.log(activeTabUrl);
        });




    }

})






