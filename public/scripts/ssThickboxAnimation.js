function getThickboxAnimationType(thickboxHyperlink){
  var classList = thickboxHyperlink.classList
  var animation_class_prefix = 'tbAnim'
  for(var cCount = 0 ; cCount !== classList.length ; cCount++){
      
      if(classList[cCount].indexOf(animation_class_prefix) > -1){
        return classList[cCount].substring(animation_class_prefix.length)
      }
  }
}



function addCSSAnimationSpin(modal){
  modal.classList.add('spin')
}

function addCSSAnimationGlide(modal){
  modal.classList.add('glide')
}

function addCSSAnimationZoom(modal){
  modal.classList.add('zoom')
}


function addCSSAnimationLegacy(modal){
  modal.classList.add('legacy')
}

function addAnimationToModal(modal, animation){
  
  switch(animation){
    case "Spin":
      addCSSAnimationSpin(modal);
      break
    case "Glide":
      addCSSAnimationGlide(modal);
      break
    case "Zoom":
      addCSSAnimationZoom(modal);
      break
    default:
      addCSSAnimationLegacy(modal);
      break
  }
}