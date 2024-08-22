var modes = {"current":"data", "data": false, "processed": false, "mask": false, "black":false, "audio": false, "submode":1, "setdata":true }
var submode = {"data":1, "processed":1, "mask":1, "black":1, "audio":1}
var params = {  "data": {1:0.5,2:0.5,3:0.5,4:0.5}, 
                "processed": {1:0.5,2:0.5,3:0.5,4:0.5}, 
                "mask": {1:0,2:0,3:0,4:0},
                "black": {1:0,2:0,3:0,4:0}, 
                "audio":{1:0,2:0.8,3:0.6,4:0},
                "viewportrot": {5:0,6:0,7:0}
            }


function activateSubmode(submodeint) {
    let mode = modes.current
    submode[mode] = submodeint
    if (mode == "data"){
        switch (submodeint){
            case 1 :{ p.rectsconfig.trigger = "note";break;}
            case 2 :{ p.rectsconfig.trigger = "cc";break;}
            case 3 :{ p.rectsconfig.trigger = "andrew";break;}
            case 4 :{ p.rectsconfig.trigger = "clock";break;} ///beatclock note 61 on tidal channel 15
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
    modes["data"] = false;
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
        solid(0).out(o3); 
        render(o3); }
}


function setParam (mode, index, value) {
    params[mode][index] = value;
    if (p.rectsconfig.trigger == "cc") {
        createRects()
    }
}

function toggle(item, cc) {

}


op1.onNote('*', ({ note, velocity, channel }) => {
    if (p.rectsconfig.trigger == "note") {
        p.rectsconfig.seed = note
        createRects()
    }
});


// beatclock
tidal.onNote(61, ({ note, velocity, channel }) => {
    if (p.rectsconfig.trigger == "clock") {
        p.rectsconfig.seed = fakeRandom(p.rectsconfig.seed) 
        createRects()
    }
});


//andrew notes
andrew.onNote("*", ({note, velocity, channel})=> {
    console.log("hello")
    if (p.rectsconfig.trigger == "andrew") {
        p.rectsconfig.seed = note
        createRects()
    }
})


op1.onCC("*", ({index, value, channel}) => {
    value = value/127;
    if (channel == 0){
        switch (index) {
            case 1: {
                if (modes.setdata) { setParam ("data", index, value);} 
                else {setParam (modes.current, index, value); }
                break; 
            }
            case 2: { 
                if (modes.setdata) {setParam ("data", index, value); }
                else {setParam (modes.current, index, value); }
                break; 
            }
            case 3: {
                if (modes.setdata) { setParam ("data", index, value);} 
                else {setParam (modes.current, index, value); }
                break; 
            }
            case 4: { 
                if (modes.setdata) {setParam ("data", index, value); }
                else {setParam (modes.current, index, value); }
                break; 
            }

            case 11: { activeMode("data", submode["data"]); break; }
            case 12: { activeMode("processed", submode["processed"]) ; break;}
            case 13: { activeMode("mask", submode["mask"]) ; break;}
            case 14: { activeMode("black", submode["black"]) ; break;}
            case 7: { activeMode("audio", submode["data"]); break; }

            case 50: {  activeMode(modes.current, 1); break;}
            case 51: {  activeMode(modes.current, 2); break;}
            case 52: {  activeMode(modes.current, 3); break;}
            case 21: {  activeMode(modes.current, 4); break;}
            case 22: {  activeMode(modes.current, 5); break;}
            case 23: {  activeMode(modes.current, 6); break;}
            case 24: {  activeMode(modes.current, 7); break;}
            case 25: {  activeMode(modes.current, 8); break;}

            case 39: {  a.setCutoff(params.audio[2]*3); p.audioreact = true; break;}
            case 40: {  a.setCutoff(100); p.audioreact = false; break;}
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
    value = value/127;
    if (channel == 0){
        switch (index) {
            case 1: { 
                // console.log("hello from tidal, ",modes.current, channel, index, value)
                setParam (modes.current, index, value); 
                break; 
            }
            case 2: { 
                setParam (modes.current, index, value);
                break; 
            }
            case 3: { 
                setParam (modes.current, index, value);
                break; 
            }
            case 4: { 
                setParam (modes.current, index, value);
                break; 
            }

            case 5: {setParam("viewportrot", index, value);break;}
            case 6: {setParam("viewportrot", index, value);break;}
            case 7: {setParam("viewportrot", index, value);break;}
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
