function initMidi(p5){

    tidal.onNote('*', ({ note, velocity, channel }) => {
        switch (channel) {
            case 0: {
                if (note != 0) {
                p5.cubesconfig.savedseed  = random(p5) 
                p5.clockupdate = true;
                p5.rectsconfig.seed = fakeRandom(p5.rectsconfig.seed) 
                }
                break;
                }

            case 1: {
                p5.cubesconfig.savedseed = note
                createCubes(p5)
                break;
                }
            case 2: {
                if (p5.rectsconfig.changemode == "shift") {
                    p5.rectsconfig.seed = note
                } else if (p5.rectsconfig.changemode == "random") {
                    p5.rectsconfig.seed = localrandom(p5.rectsconfig.seed)
                }
                createRects(p5)
                break;
                }    
            case 3: {
                // p5.imgconfig.seed = note
                // createRects()
                break;
                }
            case 4: {
                p5.linesconfig.seed = note
                createLines(p5)
                break;
                }
            }
    });


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
                case 39: {  a.setCutoff(p5.viewportconf.audioCutoff); p5.audioreact = true; break;} // play button
                case 40: {  a.setCutoff(100); p5.audioreact = false; break;} // stop button

                /// END OF OP1 CONTROLLER VALUES


            }

            if (modes.current == "audio") {
                if (p5.audioreact == true){
                    p5.activeaudiobin = Math.round(params.audio[1]*7)
                    a.setCutoff(params.audio[2]*3)
                    a.setScale(params.audio[3]*10)  
                }
            }
        }
    });

    tidal.onCC("*", ({index, value, channel}) => {
        // console.log(value)
        value = value/127;
        if (channel == 0){
            switch (index) {
                case 64: { p5.viewportconf.rotX = value ;break;}
                case 65: { p5.viewportconf.rotY = value ;break;}
                case 66: { p5.viewportconf.rotZ = value ;break;}
                case 67: { p5.viewportconf.rotSpeedX = value*0.001;break;}
                case 68: { p5.viewportconf.rotSpeedY = value*0.001;break;}
                case 69: { p5.viewportconf.rotSpeedZ = value*0.001;break;}
                case 70: { p5.viewportconf.offX = value ;break;}
                case 71: { p5.viewportconf.offY = value ;break;}
                case 72: { p5.viewportconf.offZ = value ;break;}
                case 73: { p5.viewportconf.offSpeedX = value*0.001;break;}
                case 74: { p5.viewportconf.offSpeedY = value*0.001;break;}
                case 75: { p5.viewportconf.offSpeedZ = value*0.001;break;}
                case 76: { 
                    if (value*127 == 0) { 
                        p5.viewportconf.cammode = "fixed"
                    } else if (value*127 == 1) { 
                        p5.viewportconf.cammode = "orbit"
                    } else if (value*127 == 2) { 
                        p5.viewportconf.cammode = "bigorbit"
                    } 
                    break;
                }
                case 77: {p5.viewportconf.audioCutoff = value*10, a.setCutoff(p5.viewportconf.audioCutoff); break; }
                case 78: {p5.viewportconf.audioScale = value*10, a.setScale(p5.viewportconf.audioScale); break; }  

                
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
                }
            }
        }
        if (channel  == 1) { /// cubes
            switch (index) {
                case 1: {
                    if (value == 1){ p5.cubesconfig.render = true; } else { p5.cubesconfig.render = false;} break;
                }
                case 2: {
                    if (value == 1/127){ p5.cubesconfig.decaymode = "time"; 
                    } else if (value == 2/127) { p5.cubesconfig.decaymode = "rms";
                    } else if (value == 3/127) { p5.cubesconfig.decaymode = "audio";
                    } else if (value == 4/127) { p5.cubesconfig.decaymode = "offset";
                    } break;
                }
                case 3: { p5.cubesconfig.decay = value + 0.001; break;
                }
                case 4: { p5.cubesconfig.cubesize = value ; break;
                }
                case 5: { p5.cubesconfig.size = value ; break;
                }
                case 6: { p5.cubesconfig.margin = value ; break;
                }
                case 7: { 
                    if (value == 1/127){ p5.cubesconfig.mode = "geom"; 
                    } else if (value == 2/127) { p5.cubesconfig.mode = "random";
                    } break;
                }
                case 8: { p5.cubesconfig.freq = value ; break;
                }
                case 9: { p5.cubesconfig.seed = value ; break;
                }
                case 10: { 
                    if (value == 1/127){ p5.cubesconfig.fill = "normal"; 
                    } else if (value == 2/127) { p5.cubesconfig.fill = "solid";
                    } else if (value == 3/127) { p5.cubesconfig.fill = "none";
                    } else if (value == 4/127) { p5.cubesconfig.fill = "texture";
                    }  break;
                }
                case 11: { p5.cubesconfig.fillC = [255,255,value*255] ; break;
                }
                case 12: { p5.cubesconfig.stroke = [255,123,value*255] ; break;
                }
                case 13: { p5.cubesconfig.strokeweight = value*10 ; break;
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
        if (channel  == 2) { ///rects
            switch (index) {
                case 1: {
                    if (value == 1){ p5.rectsconfig.render = true; } else { p5.rectsconfig.render = false;} break;
                }
                case 2: {
                    p5.rectsconfig.quantity = value*50; break;
                }
                case 3: { p5.rectsconfig.rot = value*3.14; break;
                }
                case 4: {
                    if (value == 1){ p5.rectsconfig.changemode = "random"; 
                    } else if (value == 2){ p5.rectsconfig.changemode = "note"; 
                    }
                    break;
                }
                case 5: {  p5.rectsconfig.sqsizeX = (value*500)+2; break;}
                case 6: {  p5.rectsconfig.sqsizeY = (value*500)+2; break;}
            }
        }

        // if (channel  == 3) {  //images
        //     switch (index) {
        //         case 1: {
        //             if (value == 1){ p5.imgconfig.render = true; } else { p5.imgconfig.render = false;} break;
        //         }
        //         case 2: {
        //             if (value == 0){ p5.imgconfig.mode = "center"; } 
        //             else if (value =1) { p5.imgconfig.mode = "cube";} break;
        //         }
        //     }
        // }

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

        if (channel  == 4) { //lines
            switch (index) {
                case 1: {
                    if (value == 1){ p5.linesconfig.render = true; } else { p5.linesconfig.render = false;} break;
                }
                case 2: {
                    if (value == 0/127){ p5.linesconfig.linemode = "ortho"; } 
                    else if (value == 1/127) { p5.linesconfig.linemode = "random";} break;
                }
                case 3: {
                    p5.linesconfig.ttl = value*255 + 100;  break;
                }
                case 4: {
                    p5.linesconfig.ttlspeed = value/2 + 0.5;  break;
                }
                case 5: {
                    p5.linesconfig.strokeweight = value*25;  break;
                }
                case 6: {
                    p5.linesconfig.size = value*50;  break;
                }
            }
        }
        if (channel  == 5) { //text
            switch (index) {
                case 1: {
                    if (value == 1){ p5.textconfig.render = true; } else { p5.textconfig.render = false;} break;
                }
            }
        }

    });

    // onc.onCC("*", ({index, value, channel}) => {
    //     if (channel  == 11) {
    //         //images
    //         switch (index) {
    //             case 1 : {
    //                 // console.log("onc1", value)
    //                 p5.oncdata1 = value;
    //                 break;
    //             }
    //             case 11 : {
    //                 p5.oncdata2 = value
    //                 break;
    //             }
    //             case 10 : {
    //                 p5.oncdata3 = value;
    //                 break;
    //             }
    //             case 2 : {
    //                 // console.log("onc4", value)
    //                 p5.oncdata4 = value;
    //                 break;
    //             }
    //         }
    //     }

    // });
}