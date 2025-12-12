/////////////
/// images //
/////////////





// index = Math.floor((Math.abs(Math.sin(m.args[2]) * seed))) % img.length;
// curimg = "img/" + img[index];

function initImgs(p5){
    p5.imgs = [];
    p5.imgconfig ={

        "render": true,
        "curImg": {},
        "seed": 0,
        "mode": "cube" //  cube, center
    }
}
  
  function preloadImg(p5,img) { 
    img.forEach(im => {
      let imobj = p5.loadImage("img/" + im);
      p5.imgs.push(imobj) 
    });
    p5.imgconfig.curImg = p5.imgs[2]
  } 
  
  function updateImgs(p5){
    p5.imgconfig.curImg =  p5.imgs[p5.imgconfig.seed % p5.imgs.length]; 
  }
  
  
  function renderImgs(p5) {
    if (p5.imgconfig.render) {
      if (p5.imgconfig.mode == "cube") {
        p5.texture(p5.imgconfig.curImg)
        p5.box( 256 + 512 * a.fft[0])
      }
      if (p5.imgconfig.mode == "center") {
      p5.image(p5.imgconfig.curImg, -p5.imgconfig.curImg.width/2, -p5.imgconfig.curImg.height/2, p5.imgconfig.curImg.width, p5.imgconfig.curImg.width)
      }
    }
    // aallelua = 1;
  }