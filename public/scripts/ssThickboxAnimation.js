function getThickboxAnimationType(thickboxHyperlink){
  
  var classList = []
  if(thickboxHyperlink){
    classList = thickboxHyperlink.classList
  }
  
  var animation_class_prefix = 'tbAnim'
  for(var cCount = 0 ; cCount !== classList.length ; cCount++){
      
      if(classList[cCount].indexOf(animation_class_prefix) > -1){
        return classList[cCount].substring(animation_class_prefix.length)
      }
  }
}



function addCSSAnimationLegacy(modal){
  modal.classList.add('legacy')
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

function addCSSAnimationLamp(modal, thickboxHyperlink){

  var { x, y, width, height} = thickboxHyperlink.getBoundingClientRect()

  var starting_position_x = x + width/2
  var starting_position_y = y - height/2

  // set initial thickbox hyperlink position as css variables for access in opening/closing animation
  document.documentElement.style.setProperty('--starting-x', starting_position_x + "px")
  document.documentElement.style.setProperty('--starting-y', starting_position_y + "px")

  modal.classList.add('lamp')
}




function addAnimationToModal(modal, thickboxHyperlink){
  
  var animation = getThickboxAnimationType(thickboxHyperlink)
  
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
      case "Lamp":
        addCSSAnimationLamp(modal, thickboxHyperlink);
        break
    default:
      addCSSAnimationLegacy(modal);
      break
  }
}