/////////////////////////////////////////////////// preloadfunctions
function fontisloaded(){
    console.log("font is loaded")
}



function imgLoadDone(image){
    imgdataset.push(image)
    p5vars.imgloaderdone = true
}

function preloadimgdataset(){
    let preimg = loadImage("/dmgdata/performsets/LID_GF_0943_0-2_GIDImg_0.png")
    // for (let i = 0; i < 12; i++) {
    //     imgdataset[i] = preimg ;
    // }
    img = preimg
}


///////////////////////////////////////////////////  data functions
function prepImgDataset(imglist){
    p5vars.imgloaderdone = false
    loginfo("prepping img dataset")
    console.log("prepping img dataset")
    // if (imgdataset.length == 0){
    //     imgpath = "LID_GF_0943_0-2_GIDImg_0.jpeg"
    //     let imageurl = dataURL + imgpath
    //     let prepimg = loadImage(imageurl)
    // }
    //     if (imglist.length == 0) {
    //         imglist = ["LID_GF_0943_0-2_GIDImg_0.jpeg"]
    //     }
    imgdataset = []
    // imglist.forEach((imgpath, key, imglist) => {
    //     let imageurl = dataURL + imgpath
    //     // console.log("TSSSSSSSS")
    //     // console.log(imageurl)
    //     let prepimg = loadImage(imageurl)
    //     imgdataset.push(prepimg)
    //     if (Object.is(imglist.length - 1, key)){
    //         console.log("loading last image")
    //         loadImage(imageurl, imgLoadDone )
    //         console.log(imgdataset.length)
    //     }
    //     // 
        
    //     });
    let i = 0;
    imglist.forEach(imgpath => {
        console.log(imgdataset.length)
        let imageurl = dataURL + imgpath
        console.log(imageurl)
        let prepimg = loadImage(imageurl)
        imgdataset[i] =  prepimg
        i++;
    })
    p5vars.imgloaderdone = true
    
    console.log("done prepping img dataset")
    

}
function prep3DDataset(obj3Dlist){
    loginfo("prepping 3D dataset")
    // console.log(globalstatus["subcollections"])
    obj3Ddataset = []
    objtexdataset = []
    if (obj3Dlist.length == 0) {
        obj3Dlist = ["/data/performsets/LID_GF_1980-0007_GID3D_0"]
    }
    obj3Dlist.forEach(obj => {
        let objurl = dataURL + obj +'.obj'
        let textrurl = dataURL + obj + '.obj.tex.png'
        // console.log(objurl)
        // console.log(textrurl)
        let preptex = loadImage(textrurl)
        objtexdataset.push(preptex)
        let prepobj = loadModel(objurl, true)
        obj3Ddataset.push(prepobj)
        });   
}

function setBufferimg(index){
    if (p5vars.imgloaderdone) {
        console.log("setting img to " + index)
        console.log(index-offset )
        imgbuffer.img = imgdataset[index]
        interfacebuffer.origimg = imgdataset[index-offset]
        // interfacebuffer.origimg = imgbuffer.img
    }
}

function setBufferObj3D(index){
    // console.log("setting object to " + index)
    obj = obj3Ddataset[index]
    textr = objtexdataset[index]
}

function setMetadata(index){
    metadata = metadataset[index]
    // loginfo("metadata loaded")
    // loginfo("metadata loaded")
    console.log(metadata)
}

function initLocaldata(data){
    /*
    currently works only with performdata.json as jsonparsed input for perform
    need to update interfacedata.json to match performdata structure for kiosk
    */
    collectiontypes = ["translation", "genImgDesc", "T3D", "GID3D", "orig3D"]

    localdata = data
    loadedartists = []
    loadedcollectionnames = []
    for (artst in data.artists) {
        loadedartists.push(artst)
        loadedcollectionnames.push(data.artists[artst].collectionname)
    }
    loadedcollections = data.collections
    currentartist = loadedartists[0]
    collectionname = data.artists[currentartist].collectionname
    // currentSUBcollection = loadedcollections[0]
    p5vars.currentsubcollection = "GIDImg"
    if (appprefix == "kioskjs") { loadCollectionMatrix() }
    if (appprefix == "performjs") { loadCollection() }
}

function loadCollection() {
    console.log("starting loadcollection " + p5vars.currentsubcollection)
    imglistpath = []
    obj3Dlist = []
    metadataset = []
    if (appprefix ==  "kioskjs"){
        //db query for available images
        dmgobjectlist = getRandomCollectionItems(db) /// gurantueed to return 4 objects with full generation
        collectionname = "random"
    } else {
        dmgobjectlist = localdata.artists[currentartist].collection   ///replace with DBcall?
    }
    loginfo("loading collection: " + p5vars.currentsubcollection)
    dmgobjectlist.forEach(dmgid => {
        metadataset.push(getMetadataForItem(db,dmgid))
        if (p5vars.currentsubcollection == "curated") {
            /// img first
            prefix = "", 
            suffix = "_0" 
            pathprefix = localdata.paths["curated"]
            path = pathprefix+prefix+dmgid
            imgpath = path+suffix+".png"
            console.log(imgpath)
            imglistpath.push(imgpath)
            /// 3D next
            if (collectionname == "random") {
                lidid = get3DForItem(db,dmgid,"orig3D")
            } else {
                prefix = "LID_" + collectionname +"_"
                suffix = "_" +  "orig3D"
                lidid=prefix+dmgid+suffix
            }
            pathprefix = localdata.paths["orig3D"]
            path = pathprefix+lidid
            objpath = path /// no extension
            obj3Dlist.push(objpath)
        }            
        if (p5vars.currentsubcollection == "TImg") {
            /// img first
            pathprefix = localdata.paths["TImg"]
            if (collectionname == "random") {
                lidid = getPNGForItem(db,dmgid, p5vars.currentsubcollection)
                img = lidid+".png"
            } else {
                prefix = "LID_" + collectionname +"_"
                suffix = "_" +  "TImg_0"
                img = prefix+dmgid+suffix+".png"
            }
            path = pathprefix+img
            imgpath = path
            console.log(imgpath)
            imglistpath.push(imgpath)
            //// then 3D
            if (collectionname == "random") {
                lidid = get3DForItem(db,dmgid,"T3D")
            } else {
                suffix3d = "_T3D_0" 
                lidid=prefix+dmgid+suffix3d
            }
            pathprefix = localdata.paths["T3D"]
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
            console.log(pathprefix)

            path = pathprefix+lidid
            objpath = path
            obj3Dlist.push(objpath)
        }        
        if (p5vars.currentsubcollection == "GIDImg") {
            ///img first
            pathprefix = localdata.paths["GIDImg"]
            if (collectionname == "random") {
                lidid = getPNGForItem(db,dmgid, p5vars.currentsubcollection)
                img = lidid+".png"
            } else {
                prefix = "LID_" + collectionname +"_"
                suffix = "_" +  "GIDImg_0"
                img = prefix+dmgid+suffix+".png"
            }
            path = pathprefix+img
            imgpath = path
            console.log(imgpath)
            imglistpath.push(imgpath)
            ///obj 
            if (collectionname == "random") {
                lidid = get3DForItem(db,dmgid,"GID3D")
                console.log("got3d" + lidid)
            } else {
                suffix3d = "_GID3D_0" 
                lidid=prefix+dmgid+suffix3d
            }
            pathprefix = localdata.paths["GID3D"]
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
            console.log(pathprefix)
            path = pathprefix+lidid
            objpath = path
            console.log(path)
            obj3Dlist.push(objpath)
            
        }

        
        
    });
    console.log("done constructing filepaths")
    console.log(imglistpath)
    console.log(obj3Dlist)
    prepImgDataset(imglistpath)
    prep3DDataset(obj3Dlist)
    loginfo('loading performance data')
}

function loadCollectionMatrix() {
    console.log("starting load matrixcollection " + p5vars.currentsubcollection)
    let imglistpath = {
        "original":[],
        "TImg":[],
        "GIDImg":[],
    }
    let obj3Dlist = {
        "orig3D": [],
        "T3D":[],
        "GID3D" :[]
    }
    let metadatasetmatrix = {
        "original": [],
        "transEN": [],
        "genImgDesc": []
    }
    let dmgobjectlist = getRandomCollectionItems(db) /// guaranteed to return pfvars.datasize objects with full generation
    collectionname = "random"
    dmgobjectlist.forEach(dmgid => {
        ///original data 2D
        prefix = "", 
        suffix = "_0" 
        pathprefix = localdata.paths["curated"]
        path = pathprefix+prefix+dmgid
        imgpath = path+suffix+".png"
        // console.log("curatedP:")
        // console.log(imgpath)
        imglistpath["original"].push(imgpath)
        /// orig 3D
        if (collectionname == "random") {
            lidid = get3DForItem(db,dmgid,"orig3D")
        } else {
            prefix = "LID_" + collectionname +"_"
            suffix = "_" +  "orig3D"
            lidid=prefix+dmgid+suffix
        }
        pathprefix = localdata.paths["orig3D"]
        path = pathprefix+lidid
        objpath = path /// no extension
        // console.log("orig3D:")
        // console.log(objpath)
        obj3Dlist["orig3D"].push(objpath)
        /// translated img 
        pathprefix = localdata.paths["TImg"]
        if (collectionname == "random") {
            lidid = getPNGForItem(db,dmgid, "TImg")
            img = lidid+".png"
        } else {
            prefix = "LID_" + collectionname +"_"
            suffix = "_" +  "TImg_0"
            img = prefix+dmgid+suffix+".png"
        }
        path = pathprefix+img
        imgpath = path
        // console.log("transimg")
        // console.log(imgpath)
        imglistpath["TImg"].push(imgpath)
        //// then 3D
        if (collectionname == "random") {
            lidid = get3DForItem(db,dmgid,"T3D")
        } else {
            suffix3d = "_T3D_0" 
            lidid=prefix+dmgid+suffix3d
        }
        pathprefix = localdata.paths["T3D"]
        // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
        // console.log(pathprefix)
        path = pathprefix+lidid
        objpath = path
        obj3Dlist["T3D"].push(objpath)
        // console.log("trans3D")
        // console.log(objpath)
        ///GIDimg first
        pathprefix = localdata.paths["GIDImg"]
        if (collectionname == "random") {
            lidid = getPNGForItem(db,dmgid, "GIDImg")
            img = lidid+".png"
        } else {
            prefix = "LID_" + collectionname +"_"
            suffix = "_" +  "GIDImg_0"
            img = prefix+dmgid+suffix+".png"
        }
        path = pathprefix+img
        imgpath = path
        // console.log("gidimg")
        // console.log(imgpath)
        imglistpath["GIDImg"].push(imgpath)
        ///obj 
        if (collectionname == "random") {
            lidid = get3DForItem(db,dmgid,"GID3D")
            console.log("got3d" + lidid)
        } else {
            suffix3d = "_GID3D_0" 
            lidid=prefix+dmgid+suffix3d
        }
        pathprefix = localdata.paths["GID3D"]
        // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
        // console.log(pathprefix)
        path = pathprefix+lidid
        objpath = path
        // console.log("GID3D")
        // console.log(path)
        obj3Dlist["GID3D"].push(objpath)

        /// original data
        let metadata = getMetadataForItem(db,dmgid)
        let description = getOriginalDescriptionForItem(db,dmgid)
        metadata["description"] = description
        metadatasetmatrix["original"].push(metadata)
        /// translation
        description = getTranslatedDescriptionForItem(db,dmgid)
        metadata["description"] = description
        metadatasetmatrix["transEN"].push(metadata)
        ///generated imgdesc
        description = getGeneratedDescriptionForItem(db,dmgid)
        metadata["description"] = description
        metadatasetmatrix["genImgDesc"].push(metadata)

    });
    // use offsets, all goes into one list, so curatedImg = [0,1,2,3], translatedImg = [4-7], ...
    let impaths = imglistpath["original"].concat(imglistpath["TImg"], imglistpath["GIDImg"])
    let obj3Dlst = obj3Dlist["orig3D"].concat(obj3Dlist["T3D"], obj3Dlist["GID3D"])
    prepImgDataset(impaths)
    prep3DDataset(obj3Dlst)
    metadataset = metadatasetmatrix["original"].concat(metadatasetmatrix["transEN"], metadatasetmatrix["genImgDesc"])
    // console.log ("metadatset length = " + metadataset.length)
    // console.log (metadataset)
    // console.log(impaths)
    // console.log(obj3Dlst)
}

function changeSubCollection(subcollection){
    p5vars.currentsubcollection = subcollection
    if (appprefix == "kioskjs") { loadCollectionMatrix() }
    if (appprefix == "performjs") { loadCollection() }
}


function loadArtist(artist) {
    // appdata = "interfacedata.json" OR "performdata.json"
    currentartist = artist
    loadCollection()
    // localdata = loadJSON('/dmgdata/'+ appdata, initLocaldata)
}

function loadNextArtist() {
    let currentindex = loadedartists.indexOf(currentartist)
    let newindex = currentindex + 1
    if (newindex >= loadedartists.length) { newindex = 0}
    artist = loadedartists[newindex]
    collectionname = loadedcollectionnames[newindex]
    loginfo("currentartist = " + artist)
    loadArtist(artist )
}    

function loadPrevArtist() {
    let currentindex = loadedartists.indexOf(currentartist)
    let newindex = currentindex - 1
    if (newindex <= 0) { newindex = loadedartists.length-1}
    artist = loadedartists[newindex]
    collectionname = loadedcollectionnames[newindex]
    loginfo("currentartist = " + artist)
    loadArtist(artist)
} 

////// render FUNCTIONS //////

function renderImgbuffer(b){
    b.background(0)
    if (p5vars.s0){
        if (p5vars.imgloaderdone){
            b.image(b.img, (ww-wh)/2, 0, wh, wh);
        }
    }
}

function render3DBuffer(b){
	b.background(0)
    if (p5vars.s1){
        b.push()
        b.scale(2)
        b.rotateX(radians(frameCount / 1))
        b.rotateY(radians(frameCount / 1))
        b.rotateZ(radians(frameCount / 1))
        b.scale(1)
        b.noFill()
        b.stroke(255)
        b.strokeWeight(0.2)
        if (hydratexture == false){
            b.texture(textr)
        } else {
            b.texture(H.get(o2))
        }
        b.lights();
        b.noStroke();
        // b.specularMaterial(50);
        // b.shininess(100);
        // b.scale(1)
        b.model(obj)
        b.pop()
    }
}

function renderP5buffer(b){
    b.background(0)
    if (p5vars.s2){
        /// p5Draw
        updateViewport(b);
        updateCam(b);
        b.push()
        b.rotateX(b.viewportconf.rotX)
        b.rotateY(b.viewportconf.rotY) 
        b.rotateZ(b.viewportconf.rotZ)
        updateParticles(b)
        drawParticles(b)
        // b.translate(-1000, -1000, -1000)
        updateCubes(b);
        renderCubes(b);
        updateLines(b);
        renderLines(b);
        updateRects(b);
        renderRects(b);
        b.pop()
    }
}


///metadata see metadata functions



function debugBox(elm, label, x, y, w, h) {
	let telm = createDiv(label).position(x, y)
	telm.style('color', '#fff')
	telm.style('font-family', 'monospace')
	telm.style('padding', '5px')
	elm.position(x, y + 20).size(w, h).value('')
	elm.style('color', '#fff')
	elm.style('background', 'none')
	elm.style('border', '1px solid #fff')
	elm.style('resize', 'none')
	elm.style('padding', '5px')
	elm.style('outline', 'none')
}

function wordwrap( str, width, brk ) {
    brk = brk || 'n';
    width = width || 75;
    if (!str) { 
       return str; 
    }
    var regex = '.{1,' +width+ '}(\s|$)' + ('|\S+?(\s|$)');
    return str.match( RegExp(regex, 'g') ).join( brk );
}

const formatTextWrap = (str, maxLineLength) => {
    if (str){
        const words = str.replace(/[\r\n]+/g, ' ').split(' ');
        let lineLength = 0;
        
        // use functional reduce, instead of for loop 
        return words.reduce((result, word) => {
        if (lineLength + word.length >= maxLineLength) {
            lineLength = word.length;
            return result + `\n${word}`; // don't add spaces upfront
        } else {
            lineLength += word.length + (result ? 1 : 0);
            return result ? result + ` ${word}` : `${word}`; // add space only when needed
        }
        }, '');
    }
}
  