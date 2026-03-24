imgprefix = "/img/masks/nobg/"
imglist = [
  ,"fuxxer_00001_.png"
  ,"fuxxer_00010_.png"
  ,"fuxxer_00017_.png"
  ,"fuxxer_00024_.png"
  ,"fuxxer_00031_.png"
  ,"fuxxer_00038_.png"
  ,"fuxxer_00045_.png"
  ,"fuxxer_00052_.png"
  ,"fuxxer_00059_.png"
  ,"fuxxer_00066_.png"
  ,"fuxxer_00073_.png"
  ,"fuxxer_00080_.png"
  ,"fuxxer_00004_.png"
  ,"fuxxer_00011_.png"
  ,"fuxxer_00018_.png"
  ,"fuxxer_00025_.png"
  ,"fuxxer_00032_.png"
  ,"fuxxer_00039_.png"
  ,"fuxxer_00046_.png"
  ,"fuxxer_00053_.png"
  ,"fuxxer_00060_.png"
  ,"fuxxer_00067_.png"
  ,"fuxxer_00074_.png"
  ,"fuxxer_00081_.png"
  ,"fuxxer_00005_.png" 
  ,"fuxxer_00012_.png"
  ,"fuxxer_00019_.png"
  ,"fuxxer_00026_.png"
  ,"fuxxer_00033_.png"
  ,"fuxxer_00040_.png"
  ,"fuxxer_00047_.png"
  ,"fuxxer_00054_.png"
  ,"fuxxer_00061_.png"
  ,"fuxxer_00068_.png"
  ,"fuxxer_00075_.png"
  ,"fuxxer_00082_.png"
  ,"fuxxer_00006_.png"
  ,"fuxxer_00013_.png"
  ,"fuxxer_00020_.png"
  ,"fuxxer_00027_.png"
  ,"fuxxer_00034_.png"
  ,"fuxxer_00041_.png"
  ,"fuxxer_00048_.png"
  ,"fuxxer_00055_.png"
  ,"fuxxer_00062_.png"
  ,"fuxxer_00069_.png"
  ,"fuxxer_00076_.png"
  ,"fuxxer_00083_.png"
  ,"fuxxer_00007_.png"
  ,"fuxxer_00014_.png"
  ,"fuxxer_00021_.png"
  ,"fuxxer_00028_.png"
  ,"fuxxer_00035_.png"
  ,"fuxxer_00042_.png"
  ,"fuxxer_00049_.png"
  ,"fuxxer_00056_.png"
  ,"fuxxer_00063_.png"
  ,"fuxxer_00070_.png"
  ,"fuxxer_00077_.png"
  ,"fuxxer_00084_.png"
  ,"fuxxer_00008_.png"
  ,"fuxxer_00015_.png"
  ,"fuxxer_00022_.png"
  ,"fuxxer_00029_.png"
  ,"fuxxer_00036_.png"
  ,"fuxxer_00043_.png"
  ,"fuxxer_00050_.png"
  ,"fuxxer_00057_.png"
  ,"fuxxer_00064_.png"
  ,"fuxxer_00071_.png"
  ,"fuxxer_00078_.png"
  ,"fuxxer_00009_.png"
  ,"fuxxer_00016_.png"
  ,"fuxxer_00023_.png"
  ,"fuxxer_00030_.png"
  ,"fuxxer_00037_.png"
  ,"fuxxer_00044_.png"
  ,"fuxxer_00051_.png"
  ,"fuxxer_00058_.png"
  ,"fuxxer_00065_.png"
  ,"fuxxer_00072_.png"
  ,"fuxxer_00079_.png"

]


// function preloadImg(p5,img) { 
//   img.forEach(im => {
//     let imobj = p5.loadImage("img/" + im);
//     p5.imgs.push(imobj) 
//   });
//   p5.imgconfig.curImg = p5.imgs[0]
// } 

function preloadImg(imglist){
  p5vars.imgloaderdone = false
  console.log("prepping img dataset")
  imgdataset = []
  let i = 0;
  imglist.forEach(imgpath => {
      console.log(imgdataset.length)
      let imageurl = imgprefix + imgpath
      console.log(imageurl)
      let prepimg = loadImage(imageurl)
      imgdataset[i] =  prepimg
      i++;
  })
  p5vars.imgloaderdone = true
  console.log("done prepping img dataset")
}

function setBufferimg(p5, index){
  if (p5vars.imgloaderdone) {
      console.log("setting img to " + index)
      console.log(index-offset )
      p5.img = imgdataset[index]
  }
}


function updateImages(p5){
  rndindex = int(random(0,imgdataset.length)) 
  // p5.img =  imgdataset[rndindex]; 
}

function randomImage(p5){
  rndindex = int(random(0,imgdataset.length)) 
  p5.img =  imgdataset[rndindex]; 
}




function renderImages(p5){
  if (p5.imgconfig.render) {
    if (p5.imgconfig.mode == "cube") {
      p5.texture(p5.img)
      p5.box( 256 + 512 * a.fft[0])
    }
    if (p5.imgconfig.mode == "center") {
    p5.image(p5.img, -p5.img.width/2, -p5.img.height/2, p5.img.width, p5.img.width)
    }
  }
  // p5.image(p5.img, -p5.img.width/2, -p5.img.height/2, p5.img.width, p5.img.width)
  
}

function initImages(p5){
  p5.imgs = []
  p5.imgconfig = {}
  p5.imgconfig.render = true ;
  p5.imgconfig.seed = 1234 ;
  preloadImg(imglist)
  randomImage(p5)

}




