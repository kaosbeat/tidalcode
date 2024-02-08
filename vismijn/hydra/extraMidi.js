// midi channel info
// midi channel 0 notes trigger rects note seed
// midi channel 1 notes trigger cubes note seed

var modes = {"current":"raw", "raw": false, "processed": false, "mask": false, "black":false, "audio": false, "submode":1, "setdata":true }
var submode = {"raw":1, "processed":1, "mask":1, "black":1, "audio":1}



function activateSubmode(submodeint) {
    console.log("activating submode ", submodeint)
    let mode = modes.current
    submode[mode] = submodeint
    if (mode == "raw"){
        switch (submodeint){
            // case 1 :{ p.rectsconfig.trigger = "note";break;}
            // case 2 :{ p.rectsconfig.trigger = "cc";break;}
            // case 3 :{ p.rectsconfig.trigger = "andrew";break;}
            // case 4 :{ p.rectsconfig.trigger = "clock";break;} ///beatclock note 61 on tidal channel 15            
            case 1 :{ src(s0).out(o1); render(o1); break;}
            case 2 :{ src(s1).out(o1); render(o1); break;}
            case 3 :{ src(s2).out(o1); render(o1); break;}
            case 4 :{ src(s3).out(o1); render(o1); break;} 
            case 5 :{src(s0).blend(s1, () => a.fft[0]*1).out(o1); render(o1); break;} 
            case 6 :{src(s0).blend(s2, () => a.fft[0]*1).out(o1); render(o1); break;} 
            case 7 :{src(s0).blend(s3, () => a.fft[0]*1).out(o1); render(o1); break;} 

            case 8 :{ modes.setdata = true; break;}


            // case 5 :{ p.rectsconfig.trigger = "modulate";break;}

        }
    } 
    else if (mode == "processed"){
        modes.setdata = false;
        switch (submodeint){
            case 1 :{ set1();break;}
            case 2 :{ set2();break;}
            case 3 :{ set3();break;}
            case 4 :{ set4();break;}
            case 8 :{ modes.setdata = true; break;}
        }
    }
    else if (mode == "mask"){
        modes.setdata = false;
        switch (submodeint){
            case 1 :{ set1();break;}
            case 2 :{ set2();break;}
            case 3 :{ set3();break;}
            case 4 :{ set4();break;}
            case 8 :{ modes.setdata = true; break;}
        }
    }
}


function activeMode(mode, submodeint){
    modes["raw"] = false;
    modes["processed"] = false;
    modes["mask"] = false;
    modes["black"] = false;
    modes["audio"] = false;
    modes[mode] = true;
    modes["current"] = mode;
    // modes["submode"] = submode;
    submode[mode] = submodeint
    activateSubmode(submodeint)
    if (modes["data"]) { 
        // activateDataSubmode(submode);
        render(o0); 
    }

    if (modes["processed"]) { 
        // activateProcessedSubmode(submode);
        render(o1); 
    }
    
    if (modes["mask"]) { render(o2); }
    
    if (modes["black"]) { 
        // solid(0).out(o3); 
        render(o3); }
}


// function setParam (mode, index, value) {
//     params[mode][index] = value;
//     if (p.rectsconfig.trigger == "cc") {
//         createRects()
//     }
// }

function toggle(item, cc) {

}


tidal.onNote('*', ({ note, velocity, channel }) => {
    switch (channel) {
        case 0: {
            if (note != 0) {
            p.cubesconfig.savedseed  = random() 
            p.clockupdate = true;
            p.rectsconfig.seed = fakeRandom(p.rectsconfig.seed) 
            }
            break;
            }

        case 1: {
            p.cubesconfig.savedseed = note
            createCubes()
            break;
            }
        case 2: {
            if (p.rectsconfig.changemode == "shift") {
                p.rectsconfig.seed = note
                createRects()
            } else if (p.rectsconfig.changemode == "random") {
                p.rectsconfig.seed = localrandom(p.rectsconfig.seed)
            } else if (p.rectsconfig.changemode == "new") {
                p.rectsconfig.seed = localrandom(p.rectsconfig.seed)
                // p.rectsconfig.seed = note
                createRects()
            }
            break;
            }    
        case 3: {
            p.imgconfig.seed = note
            // createRects()
            break;
            }
        case 4: {
            p.linesconfig.seed = note
            createLines()
            break;
            }
        }
});




// // beatclock
// tidal.onNote(0, ({ note, velocity, channel }) => {
//     if (p.rectsconfig.trigger == "clock") {
//         p.rectsconfig.seed = fakeRandom(p.rectsconfig.seed) 
//         createRects()
//     }
// });


// //andrew notes
// tidal.onNote("*", ({note, velocity, channel})=> {
//     // console.log("hello")
//     if (p.rectsconfig.trigger  == "andrew") {
//         p.rectsconfig.seed = note
//         createRects()
//     }
// })


op1.onCC("*", ({index, value, channel}) => {
    // this part is the part that is 
    value = value/127;
    if (channel == 0){  //reserve channel 0 for controller or OP1
        switch (index) {
            case 1: { // blue knob
                if (modes.setdata) { setParam ("data", index, value);} 
                else {setParam (modes.current, index, value); }
                break; 
            }
            case 2: { // green knob
                if (modes.setdata) {setParam ("data", index, value); }
                else {setParam (modes.current, index, value); }
                break; 
            }
            case 3: { //white knob
                if (modes.setdata) { setParam ("data", index, value);} 
                else {setParam (modes.current, index, value); }
                break; 
            }
            case 4: { //orange knob
                if (modes.setdata) {setParam ("data", index, value); }
                else {setParam (modes.current, index, value); }
                break; 
            }

            case 5: { break; } // help mode (blue button)
            case 6: { break; } // metronome mode (blue button)

            case 7: { activeMode("audio", submode["data"]); break; } // synth mode (blue button)
            case 8: { break; } // drum mode (green button)
            case 9: {  break; } // tape mode (orange button)
            case 10: {  break; } // mix mode 

            case 11:  // tape channel 1 
                { activeMode("raw", submode["raw"]); break; }
            case 12:  // tape channel 2
                { activeMode("processed", submode["processed"]) ; break;}
            case 13: // tape channel 3
                { activeMode("mask", submode["mask"]) ; break;}
            case 14: // tape channel 4
                { activeMode("black", submode["black"]) ; break;}

            case 15: { break; } // lift  (orange arrow up button)
            case 16: { break; } // drop  (orange arrow down button)
            case 17: { break; } //  cut  (orange scissors)

            case 50: {  activeMode(modes.current, 1); break;}  // preset 1
            case 51: {  activeMode(modes.current, 2); break;}  // preset 2
            case 52: {  activeMode(modes.current, 3); break;}  // preset 3
            case 21: {  activeMode(modes.current, 4); break;}  // preset 4
            case 22: {  activeMode(modes.current, 5); break;}  // preset 5
            case 23: {  activeMode(modes.current, 6); break;}  // preset 6
            case 24: {  activeMode(modes.current, 7); break;}  // preset 7
            case 25: {  activeMode(modes.current, 8); break;}  // preset 8

            // right button group
            case 26: {  ; break;}  // preset arp mode
            case 49: {  ; break;}  // preset com mode
            case 48: {  ; break;}  // preset rec mode button (orange mic)

            case 38: { break; } // rec button (orange circle button)
            case 39: {  a.setCutoff(p.viewportconf.audioCutoff); p.audioreact = true; break;} // play button
            case 40: {  a.setCutoff(100); p.audioreact = false; break;} // stop button

            /// END OF OP1 CONTROLLER VALUES


        }

        if (modes.current == "audio") {
            if (p.audioreact == true){
                p.activeaudiobin = Math.round(params.audio[1]*7)
                a.setCutoff(params.audio[2]*3)
                a.setScale(params.audio[3]*10)  
            }
        }
    }
});

tidal.onCC("*", ({index, value, channel}) => {
    console.log("CONTROLLER", index, "reporting", value , "on channel" , channel)
    value = value/127;
    if (channel == 0){
        switch (index) {



            case 64: { p.viewportconf.rotX = value ;break;}
            case 65: { p.viewportconf.rotY = value ;break;}
            case 66: { p.viewportconf.rotZ = value ;break;}
            case 67: { p.viewportconf.rotSpeedX = value*0.001;break;}
            case 68: { p.viewportconf.rotSpeedY = value*0.001;break;}
            case 69: { p.viewportconf.rotSpeedZ = value*0.001;break;}
            case 70: { p.viewportconf.offX = value ;break;}
            case 71: { p.viewportconf.offY = value ;break;}
            case 72: { p.viewportconf.offZ = value ;break;}
            case 73: { p.viewportconf.offSpeedX = value*0.001;break;}
            case 74: { p.viewportconf.offSpeedY = value*0.001;break;}
            case 75: { p.viewportconf.offSpeedZ = value*0.001;break;}
            case 76: { 
                if (value*127 == 0) { 
                    p.viewportconf.cammode = "fixed"
                } else if (value*127 == 1) { 
                    p.viewportconf.cammode = "orbit"
                } else if (value*127 == 2) { 
                    p.viewportconf.cammode = "bigorbit"
                } 
                break;
            }
            case 77: {p.viewportconf.audioCutoff = value*10, a.setCutoff(p.viewportconf.audioCutoff); break; }
            case 78: {p.viewportconf.audioScale = value*10, a.setScale(p.viewportconf.audioScale); break; }  


            case 80: {p.params.processed[1] = value; break}
            case 81: {p.params.processed[2] = value; break}
            case 82: {p.params.processed[3] = value; break}
            case 83: {p.params.processed[4] = value; break}

            
            case 127: {
                if (value*127 == 0) {set0()}
                if (value*127 == 1) {set1()}
                if (value*127 == 2) {set2()}
                if (value*127 == 3) {set3()}
                if (value*127 == 4) {set4()}
                if (value*127 == 5) {set5()}
                if (value*127 == 6) {set6()}
                if (value*127 == 7) {set7()}
                if (value*127 == 8) {set8()}
                if (value*127 == 9) {set9()}
                if (value*127 == 10) {set10()}
                if (value*127 == 11) {set11()}
                if (value*127 == 12) {set12()}
                if (value*127 == 13) {set13()}
                if (value*127 == 14) {set14()}
                if (value*127 == 15) {set15()}
                if (value*127 == 16) {set16()}
            }
        }
    }
    if (channel  == 1) {
        switch (index) {
            case 1: {
                if (value == 1){ p.cubesconfig.render = true; } else { p.cubesconfig.render = false;} break;
            }
            case 2: {
                if (value == 1/127){ p.cubesconfig.decaymode = "time"; 
                } else if (value == 2/127) { p.cubesconfig.decaymode = "rms";
                } else if (value == 3/127) { p.cubesconfig.decaymode = "audio";
                } else if (value == 4/127) { p.cubesconfig.decaymode = "offset";
                } break;
            }
            case 3: { p.cubesconfig.decay = value + 0.001; break;
            }
            case 4: { p.cubesconfig.cubesize = value ; break;
            }
            case 5: { p.cubesconfig.size = value ; break;
            }
            case 6: { p.cubesconfig.margin = value ; break;
            }
            case 7: { 
                if (value == 1/127){ p.cubesconfig.mode = "geom"; 
                } else if (value == 2/127) { p.cubesconfig.mode = "random";
                } break;
            }
            case 8: { p.cubesconfig.freq = value ; break;
            }
            case 9: { p.cubesconfig.seed = value ; break;
            }
            case 10: { 
                if (value == 1/127){ p.cubesconfig.fill = "normal"; 
                } else if (value == 2/127) { p.cubesconfig.fill = "solid";
                } else if (value == 3/127) { p.cubesconfig.fill = "none";
                } else if (value == 4/127) { p.cubesconfig.fill = "texture";
                }  break;
            }
            case 11: { p.cubesconfig.fillC = [255,255,value*255] ; break;
            }
            case 12: { p.cubesconfig.stroke = [255,123,value*255] ; break;
            }
            case 13: { p.cubesconfig.strokeweight = value*10 ; break;
            }
            

            // "mode":"random", 
            //       "freq": 1, 
            //       "seed": 1,"savedseed": 1,
            //       "fill": "normal",
            //       "fillC": [255,0,0],
            //       "stroke": [255,255,255],
            //       "strokeweight":0.5,
        }
    }
    if (channel  == 2) {
        switch (index) {
            case 1: {
                if (value == 1){ p.rectsconfig.render = true; } else { p.rectsconfig.render = false;} break;
            }
            case 2: {
                p.rectsconfig.quantity = value*50; break;
            }
            case 3: { p.rectsconfig.rot = value*3.14; break;
            }
            case 4: {
                console.log("MYVALUIE = ", value)
                if (value == 1/127){ p.rectsconfig.changemode = "random"; 
                } else if (value == 2/127){ p.rectsconfig.changemode = "shift"; 
                } else if (value == 3/127){ p.rectsconfig.changemode = "new"; }
                break;
            }
            case 5: {  p.rectsconfig.sqsizeX = (value*500)+2; break;}
            case 6: {  p.rectsconfig.sqsizeY = (value*500)+2; break;}
            case 127: {createRects(); break;}
        }
    }

    // "render": true,
    // "changemode": "random", // "random", "sequential", "seed", "shift", "swap"
    // "rot": 0,
    // "quantity": 5,
    // "mode":"free",  // "preset or free"
    // "trigger": "note",
    // "update": "clock",  //"counter, "clock", "link"
    // "preset": 0,
    // "seed": 1337,
    // "xoff": 10,
    // "yoff" : 10,
    // "zoff" : -500,
    // "sqsizeX" : 500,
    // "sqsizeY" : 250,
    // "fieldsizeX": rw/2,
    // "fieldsizeY": rh/2,
    // "counter" : 0,
    // "counterreset": 100,

    if (channel  == 3) {
        //images
        switch (index) {
            case 1: {
                if (value == 1){ p.imgconfig.render = true; } else { p.imgconfig.render = false;} break;
            }
            case 2: {
                if (value == 0){ p.imgconfig.mode = "center"; } 
                else if (value =1) { p.imgconfig.mode = "cube";} break;
            }
        }
    }

////////////////////////////////
//// lines lines lines lines////
////////////////////////////////

    // linemode": "ortho", //"random", // "ortho",
    //               "ttl":255,
    //               "min":-500, 
    //               "max":500,
    //               "strokeweight": 5,
    //               "ttlspeed": 0.95,
    //               "ttlup":100,
    //               "ttldown":50,
    //               "size":20, 
    //               "seed" : 1337,
    //               "margin":100
    //             }

    if (channel  == 4) {
        //images
        switch (index) {
            case 1: {
                if (value == 1){ p.linesconfig.render = true; } else { p.linesconfig.render = false;} break;
            }
            case 2: {
                if (value == 0/127){ p.linesconfig.linemode = "ortho"; } 
                else if (value == 1/127) { p.linesconfig.linemode = "random";} break;
            }
            case 3: {
                p.linesconfig.ttl = value*255 + 100;  break;
            }
            case 4: {
                p.linesconfig.ttlspeed = value/2 + 0.5;  break;
            }
            case 5: {
                p.linesconfig.strokeweight = value*25;  break;
            }
            case 6: {
                p.linesconfig.size = value*50;  break;
            }
        }
    }


});

// var prevdatamodecc = 0
// var prevprocessedmodecc = 0
// var prevmaskmodecc = 0
// var datamodecc = 0
// var processedmodecc = 0
// var maskmodecc = 0
// var active = o1

// function activateMode(prevmodecc, modecc, modeindex) {
//     if (modecc == 1 && prevmodecc != modecc) {
//         prevmodecc = modecc
//         if (modes[modeindex] == false) {
//             modes["datamode"] = false;
//             modes["processedmode"] = false;
//             modes["maskmode"] = false;
//             modes[modeindex] = true;
//         }
//         console.log(modes)

//     }
//     return prevmodecc, modes
// }


//check and change CCs every frame

// update = () => (


//     // prevdatamodecc,modes = activateMode(prevdatamodecc, _cc(11), "datamode"),
//     // prevprocessedmodecc,modes = activateMode(prevprocessedmodecc, _cc(12), "processedmode"),
//     // prevmaskmodecc,modes = activateMode(prevmaskmodecc, _cc(13), "maskmode")

// )
