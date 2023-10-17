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

function createModalElement(strModalAjaxURL, strHeaderText)
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
        modalBody.innerHTML = 'could not find url to populate modal';
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
    var params_string = strModalAjaxURL.substring(url_params_starting_index + 1)

    var search_params = params_string.split("&");

    var width = default_thickbox_width;
    var height = default_thickbox_height;

    for(var pCount=0 ; pCount != search_params.length ; pCount++){
        
        var param_key_value_pair = search_params[pCount].split("=")

        if(param_key_value_pair[0] === "width"){
            width = param_key_value_pair[1]
        }

        if(param_key_value_pair[0] === "height"){
            height = param_key_value_pair[1]
        }
    }

    // const searchParams = new URLSearchParams(params_string);

    // if(searchParams.has('width')){
    //     width = searchParams.get('width')
    // }

    // if(searchParams.has('height')){
    //     height = searchParams.get('height')
    // }

    return {width, height}
}

function resizeThickbox(width, height)
{
    var existing_modal = document.getElementById("TB_window")
    
    existing_modal.style.maxWidth = width + "px"
    existing_modal.style.maxHeight = height + "px"


}

function ssNewThickbox(strModalAjaxURL, strHeaderText="")
{
    var existing_modal = document.getElementById("TB_window")
    if(existing_modal){
        existing_modal.remove();
    }

    var modal = createModalElement(strModalAjaxURL, strHeaderText)

    modal.showModal();

    var modalBody = document.getElementById('TB_ajaxContent')
    
    populateModalWithAjaxRequest(modalBody, strModalAjaxURL)
}

function showModalOnButtonPress(event)
{
    // stop <a> from redirecting to [href]
    event.preventDefault();

    var thickboxButton = event.target
    var strHeaderText = thickboxButton.getAttribute('title');

    var strModalAjaxURL = thickboxButton.getAttribute('href');

    ssNewThickbox(strModalAjaxURL, strHeaderText)
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