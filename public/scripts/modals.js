function addClosingProceduresToModal(modal, animationTimeMs=200)
{
    modal.addEventListener('click', function (event) {
        // Check if event.target (the thing being clicked) was the modal 
        // this will only be true if you click on the modal's ::backdrop
        if (event.target === modal)
        {
        
            modal.classList.add('closing');
            setTimeout(() => {
                modal.remove()
            }, animationTimeMs)
        }
    })

    modal.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            
            modal.classList.add('closing');
            setTimeout(() => {
                modal.remove()
            }, animationTimeMs)
        }
    });

    var TB_closeWindowButtonButton = document.getElementById("TB_closeWindowButton")

    TB_closeWindowButtonButton.addEventListener('click',  function () {
        modal.classList.add('closing');
        setTimeout(() => {
            modal.remove()
        }, animationTimeMs)
    })

    modal.classList.add("closeTB_windowapplied")
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

    return {width, height}
}

function createModalElement(thickbox_ajax_url, thickbox_header)
{
    
    var {width, height} = getThickboxDimentionsFromUrl(thickbox_ajax_url)

    var modal = document.createElement('dialog');
    modal.id = "TB_window";

    modal.style.maxWidth = width + "px"
    modal.style.maxHeight = height + "px"

    var headerElement = document.createElement('div');
    headerElement.id = 'TB_title';

    var headerText = document.createElement('div');
    headerText.id = 'TB_ajaxWindowTitle';
    headerText.innerHTML = thickbox_header;

    

    var TB_closeWindowButtonLink = document.createElement('a');
    TB_closeWindowButtonLink.id = 'TB_closeWindowButton';
    TB_closeWindowButtonLink.textContent = 'close';

    // TB_closeAjaxWindow
    var TB_closeAjaxWindow = document.createElement('div');
    TB_closeAjaxWindow.id = 'TB_closeAjaxWindow'
    TB_closeAjaxWindow.appendChild(TB_closeWindowButtonLink)

    // Add the header text and close button to the header
    headerElement.appendChild(headerText);
    headerElement.appendChild(TB_closeAjaxWindow);

    var modalBody = document.createElement('div');
    modalBody.id = 'TB_ajaxContent';

    // default modal body while the ajax loads 
    var loadingImg = document.createElement('img')
    loadingImg.src= 'http://sslib.co.uk/ssLib/Images/ssLoading.gif'
    loadingImg.alt = 'loading';
    modalBody.appendChild(loadingImg);

    // Add the header and body to the dialog
    modal.appendChild(headerElement);
    modal.appendChild(modalBody);

    return modal
}


async function populateModalBodyWithAjaxRequest (strModalAjaxURL)
{
    var response = await fetch(strModalAjaxURL)
    var modal_content_from_request = await response.text();
    
    var modalBody = document.getElementById('TB_ajaxContent')
    
    if(response.ok){
        modalBody.innerHTML = modal_content_from_request
        
        var bodyAsDom = new DOMParser().parseFromString(modal_content_from_request, "text/xml");
        var scriptsToRun = bodyAsDom.getElementsByTagName('script')

        for(var sCount=0 ; sCount !== scriptsToRun.length ; sCount++){
            eval(scriptsToRun[sCount].innerHTML)
        }
        

    }else{
        modalBody.innerHTML = 'could not find url to populate modal';
    }
}


function resizeThickbox(width, height)
{
    var existing_modal = document.getElementById("TB_window")
    
    existing_modal.style.maxWidth = width + "px"
    existing_modal.style.maxHeight = height + "px"


}

function ssNewThickbox(thickbox_ajax_url, thickbox_header="", thickbox_animation_type="")
{
    var existingModal = document.getElementById("TB_window")
    if(existingModal){
        existingModal.remove();
    }
    
    var modal = createModalElement(thickbox_ajax_url, thickbox_header)
    
    document.body.appendChild(modal);
    
    addClosingProceduresToModal(modal, 200)

    // defined in ssThickboxAnimation
    if(!(addAnimationToModal === undefined)){
        addAnimationToModal(modal, thickbox_animation_type)
    }

    modal.showModal();
    populateModalBodyWithAjaxRequest(thickbox_ajax_url)
}


function showModalOnButtonPress(event)
{
    // stop <a> from redirecting to [href]
    event.preventDefault();

    var thickboxHyperlink = event.target
    var thickbox_header = thickboxHyperlink.getAttribute('title');

    var thickbox_ajax_url = thickboxHyperlink.getAttribute('href');
    

    thickbox_ajax_url = thickbox_ajax_url + "&blnAjax=Yes"
    //replace spaces with %20 for IE7 (and maybe others)
    thickbox_ajax_url=thickbox_ajax_url.replace(/ /gi,"%20")
    

    var thickbox_animation_type = ""
    
    // defined in ssThickboxAnimate
    if(getThickboxAnimationType !== undefined){
        thickbox_animation_type = getThickboxAnimationType(thickboxHyperlink);
    }

    console.log("^", thickbox_animation_type);

    // run check animation function in thickboxAnimation.js
    // defineModalAnimation && defineModalAnimation(classList)

    ssNewThickbox(thickbox_ajax_url, thickbox_header, thickbox_animation_type)
}


function initialiseTB_windowOpenningProcedures()
{
    var thickboxButtons = document.getElementsByClassName('thickbox');

    for (var ombCount = 0; ombCount < thickboxButtons.length; ombCount++)
    {
        // ssHasClass
        // add class thickboxapplied not openTB...
        if(!thickboxButtons[ombCount].classList.contains('openTB_windowapplied'))
        {
            thickboxButtons[ombCount].addEventListener('click', showModalOnButtonPress)
            // ssAddClass
            thickboxButtons[ombCount].classList.add('openTB_windowapplied')
        }
    }
}

initialiseTB_windowOpenningProcedures()