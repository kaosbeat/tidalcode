function updateMetaData() {
    // console.log("metadata print")
    // console.log(metadata)
    p5vars.primary = metadata.title
    p5vars.secondary = metadata.materials[0]


}


function drawMetadata(b) {
    updateMetaData()
    b.background(0)
    if(p5vars.s3){
        b.rectMode(CORNER)
        b.strokeWeight(3)
        b.stroke(255)
        b.fill(255)
        b.rect(110,110,133,123)
        b.rectMode(CENTER)
        b.background(0)
        b.noStroke()
        b.push()
        // b.translate(-width/2, -height/2)
        b.fill(255)
        
        if (p5vars.primary.length > 40) {
            b.textSize(basesize*1.5)
            text = p5vars.primary
            if (p5vars.primary.length > 70) {
                text = p5vars.primary.slice(0, 70).split(" ").slice(0,-1).join(" ")
            }
            
        }
        else {
            b.textSize(basesize*2)
            text = p5vars.primary
        }
        b.text(text, wg*0.5,hg*9.7)
        b.text(p5vars.secondary, wg*0.5,hg*0.7)
        // if (p5vars.overlay) {
            
        // }
        // draw currentdata
        for (inf in info){
            // console.log(info)
            b.push()
            b.textAlign(RIGHT)
            b.translate(wg*9.4, 0)
            b.textSize(basesize*0.7)
            b.text(info[inf], wg*0.5,hg*0.7+basesize*0.7*inf)
            b.pop()
        }

        // draw layer info
        b.push()
            b.textAlign(RIGHT)
            b.strokeWeight(1)
            b.translate(wg*9.2, hg*3)
            b.fill(255)
            if (p5vars.cubes == "enabled") {
                b.fill(0,255,0)
            } else {

                b.fill(255,0,0)
            }
            b.rect(wg*0.7,0,30,30)
            b.textSize(basesize)
            b.text("cubes",wg*0.7-35,0)
            b.text(p5vars.cubes,wg*0.7-35,15)

            

            ///lines
            b.translate(0, hg*0.5)
            if (p5vars.lines == "enabled") {
                b.fill(0,255,0)
            } else {
                b.fill(255,0,0)
            }
            b.rect(wg*0.7,0,30,30)
            b.textSize(basesize)
            b.text("lines",wg*0.7-35,0)
            b.text(p5vars.lines,wg*0.7-35,15)

            //rects
            b.translate(0, hg*0.5)
            if (p5vars.rects == "enabled") {
                b.fill(0,255,0)
            } else {
                b.fill(255,0,0)
            }
            b.rect(wg*0.7,0,30,30)
            b.textSize(basesize)
            b.text("rects",wg*0.7-35,0)
            b.text(p5vars.rects,wg*0.7-35,15)

            //textparts
            b.translate(0, hg*0.5)
            if (p5vars.textparts == "enabled") {
                b.fill(0,255,0)
            } else {
                b.fill(255,0,0)
            }
            b.rect(wg*0.7,0,30,30)
            b.textSize(basesize)
            b.text("textparts",wg*0.7-35,0)
            b.text(p5vars.textparts,wg*0.7-35,15)
            
            //coll2D
            b.translate(0, hg*0.5)
            if (p5vars.coll2D == "enabled") {
                b.fill(0,255,0)
            } else {
                b.fill(255,0,0)
            }
            b.rect(wg*0.7,0,30,30)
            b.textSize(basesize)
            b.text("collection 2D",wg*0.7-35,0)
            b.text(p5vars.coll2D,wg*0.7-35,15)
            
            //coll3D
            b.translate(0, hg*0.5)
            if (p5vars.coll3D == "enabled") {
                b.fill(0,255,0)
            } else {
                b.fill(255,0,0)
            }
            b.rect(wg*0.7,0,30,30)
            b.textSize(basesize)
            b.text("collection 3D",wg*0.7-35,0)
            b.text(p5vars.coll3D,wg*0.7-35,15)

        b.pop()

        ///end interface
        b.pop()
    }
}

function loginfo(text){
    info.shift()
    info.push(text)
}

