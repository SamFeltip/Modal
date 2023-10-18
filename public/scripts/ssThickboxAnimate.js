function addCSSAnimation(modal, animation_style){
  animation_style = animation_style.toLowerCase()
  modal.classList.add(animation_style)
  return modal
}

function getThickboxAnimationType(thickboxHyperlink){
  var classList = thickboxHyperlink.classList
  var animation_class_prefix = 'tbAnim'
  for(var cCount = 0 ; cCount !== classList.length ; cCount++){
      
      if(classList[cCount].indexOf(animation_class_prefix) > -1){
        return classList[cCount].substring(animation_class_prefix.length)
      }
  }

  return ""
}

function addAnimationToModal(modal, animation){
  
  console.log(animation);
  
  switch(animation){
    case "Spin":
    case "Glide":
    case "Zoom":
      modal = addCSSAnimation(modal, animation)
    default:
  }

  return modal
}