function addClosingProceduresToModal(modal)
{
    modal.addEventListener('click', function (event){
        // Check if event.target (the thing being clicked) was the modal 
        // this will only be true if you click on the modal's ::backdrop
        if (event.target === modal)
        {
            modal.classList.add('closing');
            setTimeout(() => {
                modal.remove()
            }, 200)
        }
    })

    var TB_closeWindowButtonButton = document.getElementById("TB_closeWindowButton")

    TB_closeWindowButtonButton.addEventListener('click',  function(){
        modal.classList.add('closing');
        setTimeout(() => {
            modal.remove()
        }, 200)
    })
}

function createModalElement(strHeaderText = "default modal header", strModalAjaxURL)
{
    
    var {width, height} = getThickboxDimentionsFromUrl(strModalAjaxURL)

    var dialog = document.createElement('dialog');
    dialog.id = "TB_window";

    dialog.style.maxWidth = width + "px"
    dialog.style.maxHeight = height + "px"

    var headerElement = document.createElement('div');
    headerElement.id = 'TB_title';

    var headerText = document.createElement('div');
    headerText.id = 'TB_ajaxWindowTitle';
    headerText.innerHTML = strHeaderText;

    var TB_closeWindowButtonLink = document.createElement('a');
    TB_closeWindowButtonLink.id = 'TB_closeWindowButton';
    TB_closeWindowButtonLink.textContent = 'close';

    // Add the header text and close button to the header
    headerElement.appendChild(headerText);
    headerElement.appendChild(TB_closeWindowButtonLink);

    var modalBody = document.createElement('div');
    modalBody.id = 'TB_ajaxContent';

    // default modal body while the ajax loads 
    var loadingImg = document.createElement('img')
    loadingImg.src= 'http://sslib.co.uk/ssLib/Images/ssLoading.gif'
    loadingImg.alt = 'loading';
    modalBody.appendChild(loadingImg);

    // Add the header and body to the dialog
    dialog.appendChild(headerElement);
    dialog.appendChild(modalBody);

    // Add the dialog to the body of the HTML document
    document.body.appendChild(dialog);

    addClosingProceduresToModal(dialog)
    dialog.classList.add("TB_windowapplied")

    return dialog
}


async function populateModalWithAjaxRequest (modalBody, strModalAjaxURL)
{
    var response = await fetch(strModalAjaxURL)
    var modalAjaxBodyContent = await response.text();

    if(response.ok){
        modalBody.innerHTML = modalAjaxBodyContent
    }else{
        modalBody.innerHTML = '';
    }
}

function getThickboxDimentionsFromUrl(strModalAjaxURL)
{
    var default_thickbox_width = "630";
    var default_thickbox_height = "440";

    if(!strModalAjaxURL){
        return {width: default_thickbox_width, height: default_thickbox_height}
    }

    var url_params_starting_index = strModalAjaxURL.indexOf("?")
    params_string = strModalAjaxURL.substring(url_params_starting_index)

    const searchParams = new URLSearchParams(params_string);
    
    var width = default_thickbox_width;
    var height = default_thickbox_height;

    if(searchParams.has('width')){
        width = searchParams.get('width')
    }

    if(searchParams.has('height')){
        height = searchParams.get('height')
    }

    return {width, height}

    // console.log(searchParams.get('width'));
    // console.log(searchParams.get('height'));

    // width_position = strModalAjaxURL.indexOf("&width=")+1 || strModalAjaxURL.indexOf("?width=")+1
    // console.log(width_position);
    
    // return {width: default_width, height: default_height}

    // if(strModalAjaxURL.contains("&width=") || strModalAjaxURL.contains("?width=")){

    // }
}

function showModalOnButtonPress(event)
{
    // stop <a> from redirecting to [href]
    event.preventDefault();

    var thickboxButton = event.target
    var strHeaderText = thickboxButton.getAttribute('title');

    var strModalAjaxURL = thickboxButton.getAttribute('href');
    var modal = createModalElement(strHeaderText, strModalAjaxURL)

    modal.showModal();
    
    var modalBody = document.getElementById('TB_ajaxContent')
    
    populateModalWithAjaxRequest(modalBody, strModalAjaxURL)
}


function initialiseTB_windowOpenningProcedures()
{
    var thickboxButtons = document.getElementsByClassName('thickbox');

    for (var ombCount = 0; ombCount < thickboxButtons.length; ombCount++)
    {
        // ssHasClass
        if(!thickboxButtons[ombCount].classList.contains('openTB_windowapplied'))
        {
            thickboxButtons[ombCount].addEventListener('click', showModalOnButtonPress)
            // ssAddClass
            thickboxButtons[ombCount].classList.add('openTB_windowapplied')
        }
    }
}

initialiseTB_windowOpenningProcedures()