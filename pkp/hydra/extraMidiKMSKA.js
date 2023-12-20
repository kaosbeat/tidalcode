var modes = {"current":"data", "data": false, "processed": false, "mask": false, "black":false }
var submode = {"data":1, "processed":1, "mask":1, "black":1}
var params = {"data": {1:0,2:0,3:0,4:0}, "processed": {1:0,2:2,3:0,4:0}, "mask": {1:0,2:0,3:0,4:0},"black": {1:0,2:0,3:0,4:0}}



function activateDataSubmode(submode){
    switch (submode){
        case 1 :{ p.rectsconfig.trigger = "note";break;}
        case 2 :{ p.rectsconfig.trigger = "cc";break;}
        case 3 :{ p.rectsconfig.trigger = "beat";break;}
        case 4 :{ p.rectsconfig.trigger = "modulate";break;}
    }
}

function activateProcessedSubmode(submode){
    switch (submode){
        case 1 :{ set1();break;}
        case 2 :{ set2();break;}
        case 3 :{ set3();break;}
    }
}




function activeMode(mode, submode){
    modes["data"] = false;
    modes["processed"] = false;
    modes["mask"] = false;
    modes["black"] = false;
    modes[mode] = true;
    modes["current"] = mode;
    
    if (modes["data"]) { 
        activateDataSubmode(submode);
        render(o0); 
    }

    if (modes["processed"]) { 
        activateProcessedSubmode(submode);
        render(o1); 
    }
    if (modes["mask"]) { render(o2); }
    if (modes["black"]) { solid(0).out(o3); render(o3); }
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



op1.onCC("*", ({index, value, channel}) => {
    if (channel == 0){
        switch (index) {
            case 1: { 
                if (modes.current == "processed") {value = value/127;}
                setParam (modes.current, index, value); break; }
            case 2: { 
                if (modes.current == "processed") {value = 2 + Math.round(value/127*6);}
                setParam (modes.current, index, value); 
                break; 
            }
            case 3: { setParam (modes.current, index, value); break; }
            case 4: { setParam (modes.current, index, value); break; }

            case 11: { activeMode("data",1); break; }
            case 12: { activeMode("processed",1) ; break;}
            case 13: { activeMode("mask",1) ; break;}
            case 14: { activeMode("black",1) ; break;}

            case 50: {  activeMode(modes.current, 1) ; break;}
            case 51: {  activeMode(modes.current, 2); break;}
            case 52: {  activeMode(modes.current, 3); break;}
            case 21: {  submode[modes.current] = 4 ; break;}
            case 22: {  submode[modes.current] = 5 ; break;}
            case 23: {  submode[modes.current] = 6 ; break;}
            case 24: {  submode[modes.current] = 7 ; break;}
            case 25: {  submode[modes.current] = 8 ; break;}
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
