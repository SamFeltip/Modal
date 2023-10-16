function createModalElement(intTargetModalID = "", strHeaderText = "default modal header", strModalBody = "<div class='modalLoading'></div>")
{
    var dialog = document.createElement('dialog');
    dialog.id = intTargetModalID;
    dialog.className = 'samModal';

    var headerElement = document.createElement('div');
    headerElement.className = 'header';

    var headerText = document.createElement('p');
    headerText.innerHTML = strHeaderText

    var closeModalButton = document.createElement('button');
    closeModalButton.className = 'closeModal';
    closeModalButton.textContent = 'X';

    // Add the header text and close button to the header
    headerElement.appendChild(headerText);
    headerElement.appendChild(closeModalButton);

    var modalBody = document.createElement('div');
    modalBody.className = 'body';

    modalBody.innerHTML = strModalBody;

    // Add the header and body to the dialog
    dialog.appendChild(headerElement);
    dialog.appendChild(modalBody);

    // Add the dialog to the body of the HTML document
    document.body.appendChild(dialog);

    addClosingProceduresToModal(dialog)
    dialog.classList.add("samModalapplied")

    return dialog
}


async function populateModalWithAjaxRequest (modalBody, strModalAjaxURL)
{
    var response = await fetch(strModalAjaxURL)
    var modalAjaxBodyContent = await response.text();
    modalBody.innerHTML = modalAjaxBodyContent
}


function showModalOnButtonPress(event)
{
    var openModalButton = event.target
    var intTargetModalID = openModalButton.getAttribute('data-modal-id');
    var strHeaderText = openModalButton.getAttribute('data-modal-header');

    var strModalAjaxURL = openModalButton.getAttribute('data-modal-url');
    var modal = document.getElementById(intTargetModalID);

    if (!modal) 
    {
        modal = createModalElement(intTargetModalID, strHeaderText)
    }

    modal.showModal();
    var modalBody = modal.getElementsByClassName("body")[0]


    if (strModalAjaxURL) 
    {
        populateModalWithAjaxRequest(modalBody, strModalAjaxURL)
    }
}


function initialiseSamModalOpenningProcedures()
{
    var openModalButtons = document.getElementsByClassName('openModal');

    for (var ombCount = 0; ombCount < openModalButtons.length; ombCount++)
    {
        // ssHasClass
        if(!openModalButtons[ombCount].classList.contains('openSamModalapplied'))
        {
            openModalButtons[ombCount].addEventListener('click', showModalOnButtonPress)
            // ssAddClass
            openModalButtons[ombCount].classList.add('openSamModalapplied')

        }
    }
}


function addClosingProceduresToModal(modal)
{
    modal.addEventListener('click', function (event){
        // Check if event.target (the thing being clicked) was the modal 
        // this will only be true if you click on the modal's ::backdrop
        if (event.target === modal)
        {
            modal.close();
        }
    })

    var closeModalButton = modal.getElementsByClassName("closeModal")[0]

    closeModalButton.addEventListener('click',  function(){
        modal.close()
    })
}


function initialiseSamModalClosingProcedures()
{
    var modals = document.getElementsByClassName('samModal');

    for (var mCount = 0; mCount != modals.length; mCount++)
    {
        // ssHasClass
        if (!modals[mCount].classList.contains("closeSamModalapplied"))
        {
            addClosingProceduresToModal(modals[mCount])
            // ssAddClass
            modals[mCount].classList.add("closeSamModalapplied")
        }
    }
}


initialiseSamModalOpenningProcedures()

initialiseSamModalClosingProcedures()