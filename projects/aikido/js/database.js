
async function initDB() {
    loginfo("loading DB")
    const sqlPromise = initSqlJs({
    locateFile: file => baseURL + appprefix + '/sql-wasm.js'
        });
    const dataPromise = fetch(dataURL + "/data/easydmgdata.db").then(res => res.arrayBuffer());
    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise])
    db = new SQL.Database(new Uint8Array(buf));
    const stmt = db.prepare("SELECT * FROM dmgdata WHERE id BETWEEN $start AND $end");
    stmt.getAsObject({$smetadatatart:1, $end:20}); 
    // Bind new values
    stmt.bind({$start:1, $end:15});
    while(stmt.step()) { //
    const row = stmt.getAsObject();
    // console.log('Here is a row: ' + JSON.stringify(row));
    }
    stmt.free();
    loginfo("database ready")
    localdata = loadJSON('/dmgdata/'+ appdata, initLocaldata)
    return db
}



function getCuratedCollectionItems(db, collection) {
    const stmt = db.prepare("SELECT * FROM lidcollection WHERE title=:title");
    const result = stmt.getAsObject({':title' : collection});
    stmt.free();
    imgslist = []
    items = eval(result.items)
    items.forEach(item => {
        // console.log(item)
    });
    return(items)
}

function getRandomCollectionItems(db) {
    const stmt = db.prepare("SELECT original_id FROM liddata WHERE generation=:gen");
    const result = stmt.getAsObject({':gen' : 3});
    itemlist = []
    while(stmt.step()) { //
        const row = stmt.getAsObject();
        // console.log(row)
        itemlist.push(row["original_id"])
        }
    stmt.free();
    // items = eval(result.items)
    // console.log(itemlist)
    itemlist.sort(() => Math.random() - 0.5);
    shortlist =  []
    itemlist.slice(0,p5vars.datasize).forEach(item => {
        shortlist.push(item)
        // console.log(item)
    });
    return(shortlist)
}



function getPNGsForItem(db, dmgid) {
    console.log(dmgid)
    debugA.value(dmgid)
    imglist = []
    const stmt = db.prepare("SELECT * FROM liddata WHERE type='png' AND original_id=:dmg_id");
    const result = stmt.getAsObject({':dmg_id' : dmgid});
    while(stmt.step()) { //
        const row = stmt.getAsObject();
        // console.log('Here is a row: ' + JSON.stringify(row));
            imglist.push(row.output)
        }

    stmt.free();
    console.log(imglist)
    debugB.value("database object removed from memory")
    return(imglist)
}

function getTitleForItem(db,dmgid){
    const stmt = db.prepare("SELECT title from dmgdata where  objectnumber=:dmg_id")
    const result = stmt.getAsObject({':dmg_id' : dmgid});
    
    stmt.free()
    if (result.title == null)
        return "Untitled"
    return result.title
}

function getOriginalDescriptionForItem(db,dmgid){
    loginfo(dmgid)
    const stmt = db.prepare("SELECT description from dmgdata where objectnumber=:dmg_id")
    const result = stmt.getAsObject({':dmg_id' : dmgid});
    let origdesc = result.description
    return origdesc
}

function getTranslatedDescriptionForItem(db,dmgid){
    const stmt = db.prepare("SELECT output from liddata where original_id=:dmg_id and type='translation' ")
    const result = stmt.getAsObject({':dmg_id' : dmgid});
    let transdesc = result.output 
    stmt.free()
    return transdesc
}

function getGeneratedDescriptionForItem(db,dmgid){
    const stmt = db.prepare("SELECT output from liddata where original_id=:dmg_id and type='genImgDesc' ")
    const result = stmt.getAsObject({':dmg_id' : dmgid});
    let genimgdesc = result.output
    stmt.free()
    return genimgdesc
}


function getPNGForItem(db,dmgid, type2d){
    const stmt = db.prepare("SELECT lidid from liddata where  original_id=:dmg_id and generation = 0")
    const result = stmt.getAsObject({':dmg_id' : dmgid});
    stmt.free()
    return result.lidid.replace("transEN", type2d+"_0")
}

function get3DForItem(db,dmgid, type3d){
    const stmt = db.prepare("SELECT lidid from liddata where  original_id=:dmg_id and generation = 1 and type = 'obj'")
    const result = stmt.getAsObject({':dmg_id' : dmgid});
    stmt.free()
    if (type3d == "orig3D"){
        return result.lidid
    } else {
        return result.lidid.replace("orig3D", type3d+"_0")
    }
}

function getMaterialsForItem(db,dmgid){
    const stmt = db.prepare("SELECT materials from dmgdata where  objectnumber=:dmg_id")
    const result = stmt.getAsObject({':dmg_id' : dmgid});
    stmt.free()
    return result.materials
}

function getMetadataForItem(db,dmgid){
    title = getTitleForItem(db,dmgid)
    materials = getMaterialsForItem(db,dmgid)
    materials = materials.replace(/'/g, '"') //replacing all ' with "
    materials = JSON.parse(materials)
    print(materials)
    return {"title": title, "materials": materials}
}



function loadCollectionImgs(collection){
    items = getCuratedCollectionItems(db, collection)
    loginfo("getting PNGs")
    loginfo(items[0])
    let pnglist = []
    console.log (items)
    items.forEach(item => {
        imglist = getPNGsForItem(db, item)
        pnglist = pnglist.concat(imglist)
        // console.log(metadataset)
    });
    // console.log(pnglist)
    prepImgDataset(pnglist)
}

function loadCollectionMetadata(collection){
    items = getCuratedCollectionItems(db, collection)
    // debugB.value("getting MetaData")
    metadataset = []
    items.forEach(item => {
        let itemmetadata = getMetadataForItem(db, item)
        metadataset.push(itemmetadata)
    });
}

function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

function loadRandom3DCombos(amount) {
    //recommend max 4
    const stmt = db.prepare("SELECT parent_id, output from liddata where type = 'obj' ")
    const result = stmt.getAsObject({});
    combolist = []
    while(stmt.step()) { //
        const row = stmt.getAsObject();
        // console.log('Here is a row: ' + JSON.stringify(row));
            combolist.push(row)
        }
    // combos = eval(result.ite)
    stmt.free();
    if (amount > combolist.length){
        amount = combolist.length
    }
    comboAmount =  getMultipleRandom(combolist, amount)
    let imgs = []
    let threeDees = []
    comboAmount.forEach(item => {
        imgs.push(item.parent_id + '.png')
        threeDees.push(item.output)
        
    });
    prepImgDataset(imgs)    
    prep3DDataset(threeDees)
    
    print(comboAmount)
}