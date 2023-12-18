
//midimappings channels 0-based!

// visuals
m0 = midi.input(1).channel('0')  //OP-1

// violin
m4 = midi.input(0).channel('4')  //viool 1
m5 = midi.input(0).channel('5')  //viool 2
m6 = midi.input(0).channel('6')  //alt
m7 = midi.input(0).channel('7')  //cello

m8 = midi.input(0).channel('8')  //spare channel

// ewi
m9 = midi.input(2).channel('9')   //ewi notes + CC via other handler
m10 = midi.input(2).channel('10')  //ewi notes + CC via other handler
m11 = midi.input(0).channel('11')
m12 = midi.input(0).channel('12')


// spare channels
m13 = midi.input(0).channel('13')
m14 = midi.input(0).channel('14')
m15 = midi.input(0).channel('15')

mididata = {  "m0":{"n":0, "v":0}, 
              "m1":{"n":0, "v":0}, 
              "m2":{"n":0, "v":0}, 
              "m3":{"n":0, "v":0}, 
              "m4":{"n":0, "v":0}, 
              "m5":{"n":0, "v":0}, 
              "m6":{"n":0, "v":0}, 
              "m7":{"n":0, "v":0}, 
              "m8":{"n":0, "v":0}, 
              "m9":{"n":0, "v":0}, 
              "m10":{"n":0, "v":0}, 
              "m11":{"n":0, "v":0}, 
              "m12":{"n":0, "v":0}, 
              "m13":{"n":0, "v":0}, 
              "m14":{"n":0, "v":0}, 
              "m15":{"n":0, "v":0}
            }

m0.onNote('*', ({ note, velocity, channel }) => {
    mididata["m0"]["n"] = note
     mididata["m0"]["v"]= velocity
})

m0.onC


m1.onNote('*', ({ note, velocity, channel }) => {
    mididata["m1"]["n"] = note
     mididata["m1"]["v"]= velocity
})

m2.onNote('*', ({ note, velocity, channel }) => {
    mididata["m2"]["n"] = note
     mididata["m2"]["v"]= velocity
})

m3.onNote('*', ({ note, velocity, channel }) => {
    mididata["m3"]["n"] = note
     mididata["m3"]["v"]= velocity
})

m4.onNote('*', ({ note, velocity, channel }) => {
    mididata["m4"]["n"] = note
     mididata["m4"]["v"]= velocity
})

m5.onNote('*', ({ note, velocity, channel }) => {
    mididata["m5"]["n"] = note
     mididata["m5"]["v"]= velocity
})

m6.onNote('*', ({ note, velocity, channel }) => {
    mididata["m6"]["n"] = note
     mididata["m6"]["v"]= velocity
})

m7.onNote('*', ({ note, velocity, channel }) => {
    mididata["m7"]["n"] = note
     mididata["m7"]["v"]= velocity
})
m8.onNote('*', ({ note, velocity, channel }) => {
    mididata["m8"]["n"] = note
     mididata["m8"]["v"]= velocity
})

m9.onNote('*', ({ note, velocity, channel }) => {
    mididata["m9"]["n"] = note
     mididata["m9"]["v"]= velocity
})

m10.onNote('*', ({ note, velocity, channel }) => {
    mididata["m10"]["n"] = note
    mididata["m10"]["v"]= velocity
})

m11.onNote('*', ({ note, velocity, channel }) => {
    mididata["m11"]["n"] = note
    mididata["m11"]["v"]= velocity
})
m12.onNote('*', ({ note, velocity, channel }) => {
    mididata["m12"]["n"] = note
    mididata["m12"]["v"]= velocity
})

m13.onNote('*', ({ note, velocity, channel }) => {
    mididata["m13"]["n"] = note
    mididata["m13"]["v"]= velocity
})

m14.onNote('*', ({ note, velocity, channel }) => {
    mididata["m14"]["n"] = note
    mididata["m14"]["v"]= velocity
})

m15.onNote('*', ({ note, velocity, channel }) => {
    mididata["m15"]["n"] = note
    mididata["m15"]["v"]= velocity
})

