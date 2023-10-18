
### TODO

- [] swipe to dismiss: either left swipe or right swipe (dismiss the correct way) will be constant for all styles of modal
- [x] small screens: fill width of screen
- [] see if you can work on the grow from link animation (as much like giene macOS)
  animation:
    scale window and move it towards link until invisible
    (reverse on open)
- [x] thickbox without tbAnim will use 'legacy' animation


### doing animation with tbAnim

- look for tbAnim classes and runs associated function to animate modal open (could make bounce, spin, glide)
- will usually be 'add class to modal' 
- keep animation in `ssThickboxAnimation.js` and `ssThickboxAnimation.css`
- `ssThickboxAnimation.js` will check string pulled via class and run functions associated for animation


### Notes
```
style.css
thickbox.css
thickboxanimation.css
```

see if its possible to make it emerge from the source `<a>` tag