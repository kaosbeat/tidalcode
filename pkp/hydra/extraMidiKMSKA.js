//mappings for noteons

op1.onNote('*', ({ note, velocity, channel }) => {
    // console.log(note, channel, velocity)
      if (p.rectsconfig.trigger = "note"){
        p.rectsconfig.seed = note
        createRects()
      }
    });


//check and change CCs every frame
 
update = () => (
        cc1 = _cc(1),
      cc2 = _cc(2),
      cc3 = _cc(3),
      cc4 = _cc(4)
  )
    