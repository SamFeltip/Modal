
### TODO

- [x] include ssThickbox.css
- [x] add generic `dialog#TB_...` to ssThickbox instead of my own file
- [x] special animations (opening/closing modal) should be in `ssThickboxAnimation.css`
- [x] double check js is animation agnostic

- [x] give `<a>` a class of `.tbAnimBounce`

- [x] make two animation types for openning (bounce and spin)

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