import "./content.css"


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "modalToggle") {
            console.log("hii");
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
        console.log(result);


        let logs = result.visitsLog ?? []
        console.log('Old');
        console.log(logs);


        logs.push({ visitDataObject })
        console.log('New');
        console.log(logs);


        chrome.storage.local.set({ visitsLog: logs }).then(() => {
            console.log("Visit is Saved bro");
        });



    })


    closeModal(modal)

}


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