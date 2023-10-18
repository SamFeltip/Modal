/* 
 * Thickbox 3.1 - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2007 cody lindley
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/

try
{
  x = jQuery("body")
}
catch(e)
{
  console.log("Error in ssThickbox.js - need to include jQuery.js for Thickbox to work.")
}

var tb_pathToImage = "../Images/ssLoading.gif";

/*!!!!!!!!!!!!!!!!! edit below this line at your own risk !!!!!!!!!!!!!!!!!!!!!!!*/

ssAddLoadEvent(initialiseThickbox)
if(!window["arrPatternStack"])
{
  var arrPatternStack = new Array;
}
arrPatternStack.push(initialiseThickbox);
arrPatternStack.push(focusFirstFieldOfThickbox);

function tb_init(domChunk)
{
  $(domChunk).click(function()
  {
    var t = this.title || this.getAttribute('tip') || null;  //ssSweetTitle.js removes titles and places their contents in the 'tip' attriubte
    //if you want to not use the title as the title in the header of a thickbox, put code in to exclude it here
    var a = this.href || this.alt;
    var g = this.rel || false;
    tb_show(t,a,g);
    this.blur();
    return false; 
  });
}

function initialiseThickbox()
{

  var anchors = ssGetElementsByClass("thickbox");
  for (var aCount=0; aCount != anchors.length; aCount++)
  {
    if (!ssHasClass(anchors[aCount], "thickboxapplied"))
    {
      //var t = anchors[aCount].href || anchors[aCount].getAttribute('tip')

      //do not apply it if it also a popup and in a frame
      blnOKToApply = true
      if(ssHasClass(anchors[aCount],"popup"))
      {
        if(parent.document.getElementById("Frame1"))
        {
          blnOKToApply = false
        }
      }
      if(blnOKToApply)
      {
        ssAddEvent(anchors[aCount], "click", function(e)
        {
          var el = ssExtractEl(e);

          while (el.nodeName.toLowerCase() != "a")
          {
            el = el.parentNode;
          }

          var t = el.title || el.getAttribute('tip') || null;  //this.getAttribute('tip')  ssSweetTitle.js removes titles and places their contents in the 'tip' attriubte
           //if you want to not use the title as the title in the header of a thickbox, put code in to exclude it here
          var a = el.href || el.alt;
          var g = el.rel || false;
          tb_show(t,a,g);
          el.blur();
          return ssStopTheRest(e);
        }, false)
        ssAddClass(anchors[aCount], "thickboxapplied")
      }
    }

  }

  imgLoader = new Image();// preload image
  imgLoader.src = tb_pathToImage;
}





function tb_show(caption, url, imageGroup) {//function called when the user clicks on a thickbox link
  //
  url = url + "&blnAjax=Yes"
  //replace spaces with %20 for IE7 (and maybe others)
  url=url.replace(/ /gi,"%20")
  if(url.substring(0,9)!="undefined")
  {
	try {
		if (typeof document.body.style.maxHeight === "undefined") {//if IE 6
			$("body","html").css({height: "100%", width: "100%"});
			$("html").css("overflow","hidden");
			if (document.getElementById("TB_HideSelect") === null) {//iframe to hide select elements in ie6
				$("body").append("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay'></div><div id='TB_window'></div>");
				$("#TB_overlay").click(tb_remove);
			}
		}else{//all others
			if(document.getElementById("TB_overlay") === null){
				$("body").append("<div id='TB_overlay'></div><div id='TB_window'></div>");
				$("#TB_overlay").click(tb_remove);
			}
		}

		if(tb_detectMacXFF()){
			$("#TB_overlay").addClass("TB_overlayMacFFBGHack");//use png overlay so hide flash
		}else{
			$("#TB_overlay").addClass("TB_overlayBG");//use background and opacity
		}

		if(caption===null){caption="";}
		$("body").append("<div id='TB_load'><img src='"+imgLoader.src+"' /></div>");//add loader to the page
		$('#TB_load').show();//show loader

		var baseURL;
	   if(url.indexOf("?")!==-1){ //ff there is a query string involved
			baseURL = url.substr(0, url.indexOf("?"));
	   }else{
	   		baseURL = url;
	   }

	   var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
	   var urlType = baseURL.toLowerCase().match(urlString);

		if(urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp'){//code to show images

			TB_PrevCaption = "";
			TB_PrevURL = "";
			TB_PrevHTML = "";
			TB_NextCaption = "";
			TB_NextURL = "";
			TB_NextHTML = "";
			TB_imageCount = "";
			TB_FoundURL = false;
			if(imageGroup){
				TB_TempArray = $("a[@rel="+imageGroup+"]").get();
				for (TB_Counter = 0; ((TB_Counter < TB_TempArray.length) && (TB_NextHTML === "")); TB_Counter++) {
					var urlTypeTemp = TB_TempArray[TB_Counter].href.toLowerCase().match(urlString);
						if (!(TB_TempArray[TB_Counter].href == url)) {
							if (TB_FoundURL) {
								TB_NextCaption = TB_TempArray[TB_Counter].title;
								TB_NextURL = TB_TempArray[TB_Counter].href;
								TB_NextHTML = "<span id='TB_next'>&nbsp;&nbsp;<a href='#'>Next &gt;</a></span>";
							} else {
								TB_PrevCaption = TB_TempArray[TB_Counter].title;
								TB_PrevURL = TB_TempArray[TB_Counter].href;
								TB_PrevHTML = "<span id='TB_prev'>&nbsp;&nbsp;<a href='#'>&lt; Prev</a></span>";
							}
						} else {
							TB_FoundURL = true;
							TB_imageCount = "Image " + (TB_Counter + 1) +" of "+ (TB_TempArray.length);
						}
				}
			}

			imgPreloader = new Image();
			imgPreloader.onload = function(){
			imgPreloader.onload = null;

			// Resizing large images - orginal by Christian Montoya edited by me.
			var pagesize = tb_getPageSize();
			var x = pagesize[0] - 150;
			var y = pagesize[1] - 150;
			var imageWidth = imgPreloader.width;
			var imageHeight = imgPreloader.height;
			if (imageWidth > x) {
				imageHeight = imageHeight * (x / imageWidth);
				imageWidth = x;
				if (imageHeight > y) {
					imageWidth = imageWidth * (y / imageHeight);
					imageHeight = y;
				}
			} else if (imageHeight > y) {
				imageWidth = imageWidth * (y / imageHeight);
				imageHeight = y;
				if (imageWidth > x) {
					imageHeight = imageHeight * (x / imageWidth);
					imageWidth = x;
				}
			}
			// End Resizing

			TB_WIDTH = imageWidth + 30;
			TB_HEIGHT = imageHeight + 60;
			$("#TB_window").append("<a href='' id='TB_ImageOff' title='Close'><img id='TB_Image' src='"+url+"' width='"+imageWidth+"' height='"+imageHeight+"' alt='"+caption+"'/></a>" + "<div id='TB_caption'>"+caption+"<div id='TB_secondLine'>" + TB_imageCount + TB_PrevHTML + TB_NextHTML + "</div></div><div id='TB_closeWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a></div>");

			$("#TB_closeWindowButton").click(tb_remove);

			if (!(TB_PrevHTML === "")) {
				function goPrev(){
					if($(document).unbind("click",goPrev)){$(document).unbind("click",goPrev);}
					$("#TB_window").remove();
					$("body").append("<div id='TB_window'></div>");
					tb_show(TB_PrevCaption, TB_PrevURL, imageGroup);
					return false;
				}
				$("#TB_prev").click(goPrev);
			}

			if (!(TB_NextHTML === "")) {
				function goNext(){
					$("#TB_window").remove();
					$("body").append("<div id='TB_window'></div>");
					tb_show(TB_NextCaption, TB_NextURL, imageGroup);
					return false;
				}
				$("#TB_next").click(goNext);

			}

			document.onkeydown = function(e){
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				if(keycode == 27){ // close
					tb_remove();
				} else if(keycode == 190){ // display previous image
					if(!(TB_NextHTML == "")){
						document.onkeydown = "";
						goNext();
					}
				} else if(keycode == 188){ // display next image
					if(!(TB_PrevHTML == "")){
						document.onkeydown = "";
						goPrev();
					}
				}
			};

			tb_position();
			$("#TB_load").remove();
			$("#TB_ImageOff").click(tb_remove);
			$("#TB_window").css({display:"block"}); //for safari using css instead of show
			};

			imgPreloader.src = url;
		}else{//code to show html

			var queryString = url.replace(/^[^\?]+\??/,'');
			var params = tb_parseQuery( queryString );

			TB_WIDTH = (params['width']*1) + 30 || 630; //defaults to 630 if no paramaters were added to URL
			TB_HEIGHT = (params['height']*1) + 40 || 440; //defaults to 440 if no paramaters were added to URL

			//if smartphone, force width to 280
			if(navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('webOS') > 0 )
			{
			  TB_WIDTH = 280;//window.getWidth() - 10
			}
			//if shallow window, make the thickbox shallow
			intWindowHeight = getWindowHeight();
			//console.log(intWindowHeight)
			if(TB_HEIGHT > intWindowHeight)
			{
			  TB_HEIGHT = intWindowHeight - 20;//window.getWidth() - 10
			}

			//if narrow window, make the thickbox narrow
			intWindowWidth = getWindowWidth();
			//console.log(intWindowHeight)
			if(TB_WIDTH > intWindowWidth)
			{
			  TB_WIDTH = intWindowWidth - 40;//window.getWidth() - 10
			}

			ajaxContentW = TB_WIDTH - 30;
			ajaxContentH = TB_HEIGHT - 45;

			if(url.indexOf('TB_iframe') != -1){// either iframe or ajax window
					urlNoQuery = url.split('TB_');
					$("#TB_iframeContent").remove();
					if(params['modal'] != "true"){//iframe no modal
						$("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a></div></div><iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;' > </iframe>");
					}else{//iframe modal
					$("#TB_overlay").unbind();
						$("#TB_window").append("<iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;'> </iframe>");
					}
			}else{// not an iframe, ajax


					if($("#TB_window").css("display") != "block"){
						if(params['modal'] != "true"){//ajax no modal
						$("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton'>close</a></div></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px'></div>");
						}else{//ajax modal
						$("#TB_overlay").unbind();
						$("#TB_window").append("<div id='TB_ajaxContent' class='TB_modal' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px;'></div>");
						}
					}else{//this means the window is already up, we are just loading new content via ajax
						$("#TB_ajaxContent")[0].style.width = ajaxContentW +"px";
						$("#TB_ajaxContent")[0].style.height = ajaxContentH +"px";
						$("#TB_ajaxContent")[0].scrollTop = 0;
						$("#TB_ajaxWindowTitle").html(caption);
					}
					//console.log("startchecking")

  strDiv = "TB_load"
  if(!document.getElementById(strDiv + "status"))
  {
    //adds the staus div if it is not already there, TO DO needs testing
    var statusDiv = document.createElement("div");
    statusDiv.setAttribute("id",strDiv + "status");
    statusDiv.setAttribute("class","hidden");
    statusDiv.setAttribute("className","hidden");
    document.getElementById(strDiv).parentNode.appendChild(statusDiv);
  }
  else
  {
    document.getElementById(strDiv + "status").innerHTML="";
  }
  ssApplyPatternsToThickboxWhenReady("TB_load",1)




			}


			$("#TB_closeWindowButton").click(tb_remove);


				if(url.indexOf('TB_inline') != -1){
					$("#TB_ajaxContent").append($('#' + params['inlineId']).children());
					$("#TB_window").unload(function () {
						$('#' + params['inlineId']).append( $("#TB_ajaxContent").children() ); // move elements back when you're finished
					});
					tb_position();
					$("#TB_load").remove();
					$("#TB_window").css({display:"block"});
				}else if(url.indexOf('TB_iframe') != -1){
					tb_position();
					if($.browser.safari){//safari needs help because it will not fire iframe onload
						$("#TB_load").remove();
						$("#TB_window").css({display:"block"});
					}
				}else{

					$("#TB_ajaxContent").load(url += "&random=" + (new Date().getTime()),function(){//to do a post change this load method
						tb_position();
						$("#TB_load").remove();
						tb_init("#TB_ajaxContent a.thickbox");
						$("#TB_window").css({display:"block"});
					});
				}


		}

		if(!params['modal']){
			document.onkeyup = function(e){
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				if(keycode == 27){ // close
					tb_remove();
				}
			};
		}

	} catch(e) {
		//nothing here
	}

  //self.setTimeout(runPatternStack,200);
  //self.setTimeout(runPatternStack,600);
  //self.setTimeout(runPatternStack,1000);
  }
}

//helper functions below
function tb_showIframe(){
	$("#TB_load").remove();
	$("#TB_window").css({display:"block"});
}

function tb_remove()
{

  //if it is busy loading, we stop the user clicking the faded screen to cancel out (thus ensuring two cannot be run at once)
  if(!document.getElementById("TB_load"))
  {

	ssAddClass(document.getElementById("TB_overlay"),"faderJune2022")
	$("#TB_imageOff").unbind("click");
	$("#TB_closeWindowButton").unbind("click");
	$("#TB_window").fadeOut(800,function(){$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
	$("#TB_load").remove();
	if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
		$("body","html").css({height: "auto", width: "auto"});
		$("html").css("overflow","");
	}
	document.onkeydown = "";
	document.onkeyup = "";
	return false;
  }
}

function tb_position() {
$("#TB_window").css({marginLeft: '-' + parseInt((TB_WIDTH / 2),10) + 'px', width: TB_WIDTH + 'px'});
	if ( !(typeof document.body.style.maxHeight === "undefined")) { // take away IE6
		$("#TB_window").css({marginTop: '-' + parseInt((TB_HEIGHT / 2),10) + 'px'});
	}


  //extrastuff to deal with differently when in iFrame (will

  if (window.parent.document.getElementById("Frame1")){
    intTopOfWindowBelowTopOfFrame = window.parent.getTopOfWindowToTopOfFrame(intCurrentiFrame)*-1

    //if the iframe is higher than the window, put it in the middle of the wondow, not the middle of the iframe
    intHeightOfiFrame = window.parent.getHeightOfiFrame(intCurrentiFrame)
    //alert("intHeightOfiFrame " + intHeightOfiFrame)

    intHalfHeightOfiFrame = parseInt(intHeightOfiFrame/2,10)
    //alert("intHalfHeightOfiFrame " + intHalfHeightOfiFrame)

    intTopOfWindowBelowTopOfFrame = window.parent.getTopOfWindowToTopOfFrame(intCurrentiFrame)*-1
    //alert("intTopOfWindowBelowTopOfFrame "  + intTopOfWindowBelowTopOfFrame)

    intWindowHeight = window.parent.getWindowHeight()
    //alert("intWindowHeight " + intWindowHeight)

    intHalfWindowHeight = parseInt(intWindowHeight/2,10)
    //alert("intHalfWindowHeight " + intHalfWindowHeight)

    intTargetDistanceFromTopOfWindow = -1*parseInt(intWindowHeight/2 - 40 - TB_HEIGHT,10)
    //alert("intTargetDistanceFromTopOfWindow " + intTargetDistanceFromTopOfWindow)

    intMarginToSubract = parseInt(intHalfHeightOfiFrame - intTopOfWindowBelowTopOfFrame - (intWindowHeight - 40 - TB_HEIGHT)/2,10)
    //alert(intMarginToSubract)//intOriginalDistanceFromTopOfiFrame

    if (intWindowHeight < intHeightOfiFrame ){


      // a couple of checks to prevent it from going off the top of the frame or off the bottom
      if (intMarginToSubract > intHalfHeightOfiFrame - 5){    //add 5 px to keep it just inside
        intMarginToSubract = intHalfHeightOfiFrame - 5;
      }

      if (intMarginToSubract < -1*(intHalfHeightOfiFrame - TB_HEIGHT - 5)){    //add 5 px to keep it just inside
        intMarginToSubract = -1*(intHalfHeightOfiFrame - TB_HEIGHT - 5);
      }


      $("#TB_window").css({marginTop: intMarginToSubract*-1 + 'px'});

    }
  }

  //if ("trythisonaniphone"=="theremaybeabuginwebkit")
  {
  //alert("boB" + document.body.scrollTop)
  //alert(document.body.scrollHeight)
  //alert(window.pageYOffset)
  //$("#TB_window").css({marginTop: (window.pageYOffset-TB_HEIGHT - 5)*-1 + 'px'});



  }

}

function tb_parseQuery ( query ) {
   var Params = {};
   if ( ! query ) {return Params;}// return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}

function tb_getPageSize(){
	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
	arrayPageSize = [w,h];
	return arrayPageSize;
}

function tb_detectMacXFF() {
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox')!=-1) {
    return true;
  }
}

function ssThickbox(url)
{
  tb_show("", url)
}

function ssApplyPatternsToThickboxWhenReady(strID,intCount)
{
//console.log(intCount)
  if (!document.getElementById("TB_load"))
  {
    //console.log("houston we have a problem")
    if (document.getElementById(strID + "status").innerHTML.toLowerCase()!="justloaded")
    {
      document.getElementById(strID + "status").innerHTML="justloaded";
      runPatternStack();
      //console.log("just run patternsatck")
    }
  }
  else
  {
    //document.getElementById("extrastatus").innerHTML="<p></p>" + intCount;
    if(intCount==100)
    {
      alert("The request took more than 10 seconds, please check your internet connection is OK.")
      self.setTimeout("ssApplyPatternsToThickboxWhenReady('" + strID + "'," + (intCount+1) + ");",100);
    }
    else
    {
      if(intCount==200)
      {
        alert("The request took more than 20 seconds, and has being abandoned.")
        //document.getElementById(strID).innerHTML="<p><img src='../Images/Exclamation.png' /> Oops, this content failed to load.</p>";
        document.getElementById(strID + "status").innerHTML="justloaded";
        //TB_overlay
        $("#TB_window").remove();
        $("#TB_overlay").remove();
        $("#TB_load").remove();
        //document.getElementById("TB_load").innerHTML = ""
        //self.setTimeout("ssApplyPatternsToThickboxWhenReady('" + strID + "'," + (intCount+1) + ");",100);
      }
      else
      {
        self.setTimeout("ssApplyPatternsToThickboxWhenReady('" + strID + "'," + (intCount+1) + ");",100);
      }
    }
  }
}

//nearly done, but not entirely perfect, but can probably ignore this scenario, it will be extremely rare...
//if you run a request which takes ages, so it fails to load, then, while that is still running you run a short one
//when the first one completes, it runs the pattern stack (without actually replacing the content), then when the second completes it does not run the pattern stack



function focusFirstFieldOfThickbox()
{

  //exclude when a special element with "doNotFocusFirstField" is present
  if(document.getElementById("TB_ajaxContent") && !document.getElementById("doNotFocusFirstField"))
  {
    var inputs = document.getElementById("TB_ajaxContent").getElementsByTagName("input");
    blnFocusedAlready = false;

    for (var b=0; b < inputs.length; b++)
    {

      //turn fieldset white when clicking on either button
      if ((ssHasClass(inputs[b],"required")) || (ssHasClass(inputs[b],"optional")) || (ssHasClass(inputs[b],"pushbutton")))
      {
        if((inputs[b].type == "text")|| (inputs[b].type == "submit"))
        {
          if (!blnFocusedAlready)
          {
            try
            {
              inputs[b].focus();
              //does not seem to work in a field in a second page in a thickbox in IE9, works in the first page
            }
            catch(e)
            {
            }
            blnFocusedAlready = true;
          }
        }
      }
    }
  }
}


function getWindowHeight()
{
  var windowHeight=0;
  if (typeof(window.innerHeight)=='number')
  {
    windowHeight=window.innerHeight;
  }
  else
  {
    if (document.documentElement&& document.documentElement.clientHeight)
    {
      windowHeight=
      document.documentElement.clientHeight;
    }
    else
    {
      if (document.body&&document.body.clientHeight)
      {
        windowHeight=document.body.clientHeight;
      }
    }
  }
  return windowHeight;
}


function getWindowWidth()
{
  var windowWidth=0;
  if (typeof(window.innerWidth)=='number')
  {
    windowWidth=window.innerWidth;
  }
  else
  {
    if (document.documentElement&& document.documentElement.clientWidth)
    {
      windowWidth=
      document.documentElement.clientWidth;
    }
    else
    {
      if (document.body&&document.body.clientWidth)
      {
        windowWidth=document.body.clientWidth;
      }
    }
  }
  return windowWidth;
}