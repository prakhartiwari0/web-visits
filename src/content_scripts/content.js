import "./content.css"


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "modalToggle") {
            modalToggle()
        }
    }
);


function createAndAppendPopup() {
    // console.log('createAndAppendPopup');
    const popupDialog = document.createElement('dialog')
    popupDialog.classList.add('visitPopupDialog')

    const dateTime = Date.now()
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()

    const currentPageUrl = window.location.href;


    const innerHTMLofPopup = ` 
    
    <button class="closePopupButton">X</button>

      <h1>Add a new Visit</h1>
      

      <span class="visitURLSpan" data-visitURL="${currentPageUrl}">${currentPageUrl}</span>

      <span class="visitDateTimeSpan" data-dateTime="${dateTime}">Visited on ${date} at ${time}</span>

      <textarea name="visitMessage" id="visitMessage" cols="30" rows="10" class="visitMessageTextarea" placeholder="Write your Message here"
				autofocus="true"
      
      ></textarea>

      			<span class="textAreaCharacterCountSpan">
			</span>


	  <button class="saveButton">Save</button>

    
    `

    popupDialog.innerHTML = innerHTMLofPopup

    const totalCharactersAllowed = 120
    const visitMessageTextarea = popupDialog.querySelector('.visitMessageTextarea')
    visitMessageTextarea.maxlength = totalCharactersAllowed


    const textAreaCharacterCountSpan = popupDialog.querySelector('.textAreaCharacterCountSpan')

    visitMessageTextarea.addEventListener('input', (event) => {

        // console.log();
        let currentCharacters = visitMessageTextarea.value.length

        if (currentCharacters > totalCharactersAllowed) {
            visitMessageTextarea.value = visitMessageTextarea.value.slice(0, totalCharactersAllowed); // Truncate the input
        }
        else {
            textAreaCharacterCountSpan.textContent = `${currentCharacters}/${totalCharactersAllowed}`
        }



    })

    document.body.appendChild(popupDialog);




    const closePopupButton = popupDialog.querySelector('.closePopupButton')
    closePopupButton.addEventListener('click', function () { closeModal(popupDialog) })


    const saveButton = popupDialog.querySelector('.saveButton')
    saveButton.addEventListener('click', function () { saveVisit() })



    // console.log("Modal is Created");
    return (popupDialog)

}


function saveVisit() {
    // console.log("Saving Visit");
    const modal = document.querySelector('.visitPopupDialog')

    let visitURL = modal.querySelector('.visitURLSpan').getAttribute('data-visitURL')
    let visitDateTime = modal.querySelector('.visitDateTimeSpan').getAttribute('data-dateTime')
    let visitMessage = modal.querySelector('.visitMessageTextarea').value
    const visitDataObject = {
        visitURL, visitDateTime, visitMessage
    }


    chrome.storage.local.get('visitsLog').then((result) => {
        // console.log(result);

        let logs = result.visitsLog ?? []
        // console.log('Old');
        // console.log(logs);

        logs.push({ visitDataObject })
        // console.log('New');
        // console.log(logs);

        chrome.storage.local.set({ visitsLog: logs }).then(() => {
            console.log("Visit is Saved bro");
        });
        
    })
    
    chrome.storage.local.get('visitedLinks').then((result) => {
        console.log(result);

        let links = result.visitedLinks ?? []
        // console.log('Old');
        // console.log(logs);

        if (links.includes(visitURL)) {
            return
        }
        links.push(visitURL)
        // console.log('New');
        // console.log(logs);

        chrome.storage.local.set({ visitedLinks: links }).then(() => {
            console.log("Link is Saved bro");
        });
        
    })
    
            // chrome.storage.local.set({ visitedLinks: visitURL }).then(() => {
            //     console.log("Link is Saved bro");
            // });
    


    closeModal(modal)

}


// Retrieve visited links array from storage
chrome.storage.local.get("visitedLinks", (data) => {
    const visitedLinks = data.visitedLinks || []; // Default to an empty array

    // console.log(data);

    // console.log(visitedLinks);

    // Retrieve the preferred color from storage
    chrome.storage.local.get("linkColor", (colorData) => {
        const preferredColor = colorData.linkColor || "green"; // Default to green if not set

        // Function to apply the color to specific links
        function applyLinkColor() {
            const links = document.getElementsByTagName("a");

            
            for (let link of links) {
                console.log("Link frrr");

                let linkHref = link.href;
                
                if (visitedLinks.includes(linkHref)) {
                    console.log("MATCH FOUND!");
                    chrome.runtime.sendMessage({ enableMenuItem: true });
                    link.style.color = preferredColor;
                }
                else{
                    chrome.runtime.sendMessage({ enableMenuItem: false });

                }
            }
        }

        // Apply the color when the page is fully loaded
        window.addEventListener("load", applyLinkColor);

        // Also apply the color on AJAX or dynamic content changes
        const observer = new MutationObserver(applyLinkColor);
        observer.observe(document.body, { childList: true, subtree: true });
    });
});



function isModalOpen() {
    // console.log('isModalOpen');
    // console.log(document.querySelector('.visitPopupDialog'));
    return document.querySelector('.visitPopupDialog').open;
}

function closeModal(modal) {
    // console.log('closeModal');
    // console.log(modal);

    modal.close();
    modal.style.display = 'none'
    document.body.removeChild(modal)


    // console.log("Modal is Destroyed");
}


function openModal(modal) {
    modal.showModal();
}


function modalToggle() {
    // console.log('modalToggle');

    let modal = document.querySelector('.visitPopupDialog') ?? null
    // console.log(modal);

    if (modal) {
        if (isModalOpen()) {
            // console.log(isModalOpen());
            // console.log("Modal is open, closing the Modal");

            closeModal(modal)
        }
        else {
            // console.log("Modal is closed, opening the Modal");
            openModal(modal);

        }

    }
    else {
        // console.log("Modal is not created, creating Modal");
        createAndAppendPopup()
        openModal(document.querySelector('.visitPopupDialog'));

    }

}