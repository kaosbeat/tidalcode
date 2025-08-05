function initMidi(p5, midiobject){
	
	midiobject.noteOn = (note) => {
		// print(note)
		p5vars.hydracount+=1;
		switch (note.channel){
			case 1 : // control params
			if (note.number != 0) {
				p5.cubesconfig.savedseed  = p5random(p5) 
				p5.clockupdate = true;
				p5.rectsconfig.seed = fakeRandom(p5.rectsconfig.seed) 
				// hydracount += 1;

			}
				break;
				
				
			case 2:  // cubes
				p5.cubesconfig.savedseed = note.number
				// loginfo("creating cubes")
				createCubes(p5)
				break;
			
			case 3:  // lines
				p5.linesconfig.seed = note
			    createLines(p5)
			    break;

			case 4: // rects
			    if (p5.rectsconfig.changemode == "shift") {
			        p5.rectsconfig.seed = note
			    } else if (p5.rectsconfig.changemode == "random") {
			        p5.rectsconfig.seed = localrandom(p5.rectsconfig.seed)
			    }
			    createRects(p5)
			    break;

			case 5: //textrenderstuff
				break;

			case 6: // collection
				overflowednumber = note.number%(imgdataset.length - 1)
				// loginfo("metadataindex = " + overflowednumber)
				setBufferimg(overflowednumber)
				// setBufferObj3D(overflowednumber)
				// setMetadata(overflowednumber)
				break;
			
			default:

				break;
		}
	}

	// midiobject.noteOff = (note) => {
	// 	// print("notOff")
	// 	// background(0, 55)
	// }

	midiobject.controlChange = (cc) => {
		print(cc)
		console.log("hello from mainmidi cc" + cc.value)
		// console.log("hello from mainmidi cc")
		///////////////////////////////////////////////////////////////////
		let index = cc.number;
		let value = cc.value;
		value = value/127;
		
		if (cc.channel == 1){  //reserve channel 0(tidal) or 1(p5live) for tidalcontroller & OP1
			switch (index) {
				case 1:  // blue knob
					p5vars.p1 = value
					break; 
				
				case 2:  // green knob
					p5vars.p2 = value
					break; 
				
				case 3:  //white knob
					p5vars.p3 = value
					break; 
				
				case 4:  //orange knob
					p5vars.p4 = value
					break; 
				

				case 5: break; // help mode (blue button)
				case 6: break; // metronome mode (blue button)

				case 7: 
					changeSubCollection("curated")
					break; // synth mode (blue button)
				case 8: 
					changeSubCollection("TImg")
					break; // drum mode (green button)
				case 9: 
					changeSubCollection("GIDImg")
					break; // tape mode (orange button)
				case 10: 
					if (value ==  1) {
						console.log("changing code visibility")
						if (p5.codeviz == true) {
							p5.codeviz = false
							nocode()
						} else {
							p5.codeviz = true
							code()
						}
						loginfo("code layer " + p5.codeviz)
					}
					break; // mix mode 

				case 11:  // tape channel 1  						
					if (value == 1) {// imageonly(); 
						if (p5vars.s0) { p5vars.s0 = false} 
						else { p5vars.s0 = true;  }
						loginfo("image layer " + p5vars.s0)
					} 
					break; 
				case 12:  // tape channel 2
					if (value == 1) {
						if (p5vars.s1) { p5vars.s1 = false} 
						else { p5vars.s1 = true; }
						loginfo("adding 3D visuals" + p5vars.s1) 
					}
					break;
				case 13: // tape channel 3
					if (value == 1) {
					// P5only(); 
						if (p5vars.s2) { p5vars.s2 = false} 
						else { p5vars.s2 = true; }
						loginfo("adding data visuals" + p5vars.s2)
					}
					break;
				case 14: // tape channel 4
					if (value == 1) {
						// dataonly(); 
						if (p5vars.s3) { p5vars.s3 = false;  } 
						else { p5vars.s3 = true;  }
						loginfo("adding data layer" + p5vars.s2 )
					}
					break;

				case 15:  
					if (value == 1) {
						loadNextArtist()
					}
					break; // lift  (orange arrow up button)
				case 16: 
					if (value == 1) {
						loadPrevArtist()
					}
					break; // drop  (orange arrow down button)
				case 17: break; //  cut  (orange scissors)

				case 50: break;  // preset 1
				case 51: break;  // preset 2
				case 52: break;  // preset 3
				case 21: break;  // preset 4
				case 22: break;  // preset 5
				case 23: break;  // preset 6
				case 24: break;  // preset 7
				case 25: break;  // preset 8

				// right button group
				case 26: break;  // preset arp mode
				case 49: break;  // preset com mode
				case 48: break;  // preset rec mode button (orange mic)

				case 38: break; // rec button (orange circle button)
				case 39: break; // play button
				case 40: break; // stop button

				/// END OF OP1 CONTROLLER VALUES
				
				/// start of tidal controller values

				case 64: { p5.viewportconf.rotX = value*3.14 ;break;}
                case 65: { p5.viewportconf.rotY = value*3.14 ;break;}
                case 66: { p5.viewportconf.rotZ = value*3.14 ;break;}
                case 67: { p5.viewportconf.rotSpeedX = value*0.05;break;}
                case 68: { p5.viewportconf.rotSpeedY = value*0.05;break;}
                case 69: { p5.viewportconf.rotSpeedZ = value*0.05;break;}
                case 70: { p5.viewportconf.offX = value ;break;}
                case 71: { p5.viewportconf.offY = value ;break;}
                case 72: { p5.viewportconf.offZ = value ;break;}
                case 73: { p5.viewportconf.offSpeedX = value*0.001;break;}
                case 74: { p5.viewportconf.offSpeedY = value*0.001;break;}
                case 75: { p5.viewportconf.offSpeedZ = value*0.001;break;}
                case 76: { 
					loginfo("setting cammode " + value*127 )
                    if (value == 0) { 
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

                
                case 119: {  ///hydramode  ///needs refactor according to hydrafunctions.js /// CC > 120 are not passed to P5LIVE
					let fx = (value*127)%(fxpipe.length)
					loginfo("setting hydramode " + fxpipe[fx].name)
					console.log("setting hydramode " + fxpipe[fx].name)
					fxpipe[fx]()
                    // if (value*127 == 1) {set1()}
                    // if (value*127 == 2) {set2()}
                    // if (value*127 == 3) {set3()}
                    // if (value*127 == 4) {set4()}
                    // if (value*127 == 5) {set5()}
                    // if (value*127 == 6) {set6()}
                    // if (value*127 == 7) {set7()}
                    // if (value*127 == 8) {set8()}
                    // if (value*127 == 9) {set9()}
                    // if (value*127 == 10) {set10()}
                    // if (value*127 == 11) {set11()}
                    // if (value*127 == 12) {set12()}
					break;
				}
			}
		}
        if (cc.channel == 2) { /// cubes  1(tidal) or 2(p5live) from tidalcycles
			
            switch (index) {
				
                case 1: {
					loginfo(value)
                    if (value == 1){ 
						p5.cubesconfig.render = true; 
						p5vars.cubes = "enabled";
					} else { 
						p5.cubesconfig.render = false;
						p5vars.cubes = "disabled";
					} 
					loginfo("enableing cubes " + p5.cubesconfig.render)
					// console.log(p5.cubesconfig)
					break;
				}
                case 2: {
                    if (value*127 == 1){ p5.cubesconfig.decaymode = "time"; 
                    } else if (value*127 == 2) { p5.cubesconfig.decaymode = "rms";
                    } else if (value*127 == 3) { p5.cubesconfig.decaymode = "audio";
                    } else if (value*127 == 4) { p5.cubesconfig.decaymode = "offset";
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
                    if (value*127 == 1){ p5.cubesconfig.mode = "geom"; 
                    } else if (value*127 == 2) { p5.cubesconfig.mode = "random";
                    } break;
                }
                case 8: { p5.cubesconfig.freq = value ; break;
                }
                case 9: { 
					console.log("setting cubeseed")
					// p5.cubesconfig.seed = 10 ;
					p5.cubesconfig.seed = value*127000 ; 
					// console.log(p5.cubesconfig)
					break;
                }
                case 10: { 
                    if (value*127 == 1){ p5.cubesconfig.fill = "normal"; 
                    } else if (value*127 == 2) { p5.cubesconfig.fill = "solid";
                    } else if (value*127 == 3) { p5.cubesconfig.fill = "none";
                    } else if (value*127 == 4) { p5.cubesconfig.fill = "texture";
                    }  break;
                }
                case 11: { p5.cubesconfig.fillC = [255,255,value*255] ; break;
                }
                case 12: { p5.cubesconfig.stroke = [255,123,value*255] ; break;
                }
                case 13: { p5.cubesconfig.strokeweight = value*10 ; break;
                }
            }
        }
        if (cc.channel  == 3) { ///rects 2(tidal) or 3(p5live)
            switch (index) {
                case 1: {
                    if (value == 1){ 
						p5.rectsconfig.render = true; 
						p5vars.rects = "enabled";
					} else { 
						p5.rectsconfig.render = false;
						p5vars.rects = "disabled";
					} 
					break;
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
        if (cc.channel  == 4) { //lines 3(tidal) or 4(p5live)
            switch (index) {
                case 1: {
                    if (value == 1){ 
						p5vars.lines = "enabled";
						p5.linesconfig.render = true; 
					} else { 
						p5.linesconfig.render = false;
						p5vars.lines = "disabled"
					} break;
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
        if (cc.channel  == 5) { //text
            switch (index) {
                case 1: {
                    if (value == 1){ 
						p5.textconfig.render = true; 
						p5vars.textparts = "enabled";
					} else { 
						p5vars.textparts = "disabled";
						p5.textconfig.render = false;
					} break;
                }
            }
        }
        if (cc.channel  == 6) { //collection img
            switch (index) {
                case 1: {
                    if (value == 1){ 
						p5vars.s0 = true;
						p5vars.coll2D = "enabled";
					} else { 
						p5vars.s0 = false;
						p5vars.coll2D = "disabled";
					} break;
                }
            }
        }
        if (cc.channel  == 7) { //collection 3D
            switch (index) {
                case 1: {
                    if (value == 1){ 
						p5vars.s1 = true;
						p5vars.coll3D = "enabled";
					} else { 
						p5vars.s1 = false;
						p5vars.coll3D = "disabled";
					} break;
                }
            }
        }
        if (cc.channel  == 8) { //metadata 
            switch (index) {
                case 1: {
                    if (value == 1){ 
						p5vars.s3 = true;
					} else { 
						p5vars.s3 = false;
					} break;
                }
            }
        }
	}
	// midiobject.pitchBend = (pb) => {
	// 	// print(pb)

	// }
}