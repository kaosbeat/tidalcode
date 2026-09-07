vidlist =["hand1.mp4", "hand2.mp4","scrollscene.mp4","hand1.mp4"]
vidprefix = "vid/"
viddataset = []

function preloadVideos(p5){
  
  let varprefix = "p5.vid" ;
  let i = 0;

  // for (i=0;i< vidlist.length; i++){
  //   eval( 'let ' + varprefix + i + '= createVideo(' + vidprefix + vidlist[i] +', VIDEO);')
  //   eval( 'viddataset[' + i + '] = ' + varprefix + i)

    // p5.vid = p5.vid1
  // }
  p5.vid1 = createVideo("vid/hands/hand01.mp4", VIDEO);
  p5.vid2 = createVideo("vid/hands/hand02.mp4", VIDEO);
  p5.vid3 = createVideo("vid/hands/hand03.mp4", VIDEO);
  p5.vid4 = createVideo("vid/hands/hand04.mp4", VIDEO);
  p5.vid5 = createVideo("vid/hands/hand05.mp4", VIDEO);
  p5.vid6 = createVideo("vid/hands/hand06.mp4", VIDEO);
  p5.vid7 = createVideo("vid/hands/hand07.mp4", VIDEO);
  p5.vid8 = createVideo("vid/hands/hand08.mp4", VIDEO);
  p5.vid9 = createVideo("vid/hands/hand09.mp4", VIDEO);
  p5.vid10 = createVideo("vid/hands/hand10.mp4", VIDEO);
  handdataset = [p5.vid1, p5.vid2,p5.vid3, p5.vid4,p5.vid5, p5.vid6,p5.vid7, p5.vid8,p5.vid9, p5.vid10]

  p5.barbievid1 = createVideo("vid/barbie/1_barbiesmell/1-1_luxury.mp4", VIDEO);
  p5.barbievid2 = createVideo("vid/barbie/1_barbiesmell/1-2_acquisition.mp4", VIDEO);
  p5.barbievid3 = createVideo("vid/barbie/1_barbiesmell/1-3_control.mp4", VIDEO);
  p5.barbievid4 = createVideo("vid/barbie/1_barbiesmell/1-4_illusion.mp4", VIDEO);
  p5.barbievid5 = createVideo("vid/barbie/2_barbietalk/2-1_possession.mp4", VIDEO);
  p5.barbievid6 = createVideo("vid/barbie/2_barbietalk/2-2_ownership.mp4", VIDEO);
  p5.barbievid7 = createVideo("vid/barbie/2_barbietalk/2-3_power.mp4", VIDEO);
  p5.barbievid8 = createVideo("vid/barbie/2_barbietalk/2-4_legacy.mp4", VIDEO);
  p5.barbievid9 = createVideo("vid/barbie/3_barbiedance/3-1_reflection.mp4", VIDEO);
  p5.barbievid10 = createVideo("vid/barbie/3_barbiedance/3-2_image.mp4", VIDEO);
  p5.barbievid11 = createVideo("vid/barbie/3_barbiedance/3-3_mirror.mp4", VIDEO);
  p5.barbievid12 = createVideo("vid/barbie/3_barbiedance/3-4_phantom.mp4", VIDEO);
  p5.barbievid13 = createVideo("vid/barbie/4_barbieQ/4-1_plastic.mp4", VIDEO);
  p5.barbievid14 = createVideo("vid/barbie/4_barbieQ/4-2_perfect.mp4", VIDEO);
  p5.barbievid15 = createVideo("vid/barbie/4_barbieQ/4-3_empty.mp4", VIDEO);
  p5.barbievid16 = createVideo("vid/barbie/4_barbieQ/4-4_hollow.mp4", VIDEO);

  
  barbiesmell = [p5.barbievid1, p5.barbievid2,p5.barbievid3, p5.barbievid4]
  barbietalk = [p5.barbievid5, p5.barbievid6,p5.barbievid7, p5.barbievid8]
  barbiedance = [p5.barbievid9, p5.barbievid10, p5.barbievid11, p5.barbievid12]
  barbieQ = [p5.barbievid13, p5.barbievid14, p5.barbievid15, p5.barbievid16]

  viddataset = barbiesmell;
  viddatasetlist = [handdataset, barbiesmell, barbietalk, barbiedance, barbieQ]
}



function preloadVideosOLD(p5, vidlist){
  p5vars.vidloaderdone = false
  console.log("prepping vid dataset")
  viddataset = []
  let i = 0;
  vidlist.forEach(vidpath => {
      console.log(viddataset.length)
      let vidurl = vidprefix + vidpath
      console.log(vidurl)
      let prepvid = createVideo(vidurl, VIDEO);
      // let prepvid = createVideo("vid/hand1.mp4");
        prepvid.size(prepvid.width, prepvid.height);
        prepvid.size(p5.width, p5.height);
        // prepvid.hide()
        prepvid.play();
        prepvid.volume(0);

    //   let prepimg = loadImage(imageurl)
      viddataset[i] =  prepvid
      i++;
  })
  p5.vids = viddataset
  p5.vid = p5.vids[1]
  p5vars.vidloaderdone = true
  console.log("done prepping vid dataset")
}

function setBufferVid(p5, index){
  if (p5vars.vidloaderdone) {
      console.log("setting vid to " + index)
      console.log(index-offset )
      p5.vid = viddataset[index]
  }
}


function updateVideos(p5){
  // rndindex = int(random(0,viddataset.length)) 
  // p5.img =  imgdataset[rndindex]; 
}

function randomVideo(p5){
  rndindex = int(random(0,viddataset.length)) 
  p5.vid =  viddataset[rndindex]; 
}




function renderVideo(p5){
  if (p5.vidconfig.render) {
    if (p5.vidconfig.mode == "cube") {
      p5.texture(p5.vid)
      p5.box( 256 + 512 * a.fft[0])
    }
    if (p5.vidconfig.mode == "center") {
    p5.image(p5.vid, -p5.vid.width/2, -p5.vid.height/2, p5.vid.width, p5.vid.width)
    }
    if (p5.vidconfig.mode == "fullscreen") {
    p5.image(p5.vid, -p5.width/2, -p5.height/2, p5.width, p5.height)
    }
  }
  // p5.image(p5.img, -p5.img.width/2, -p5.img.height/2, p5.img.width, p5.img.width)
  
}

function initVideos(p5){
  p5.vids = []
  p5.vidconfig = {}
  p5.vidconfig.mode = "cube"
  p5.vidconfig.render = true ;
  p5.vidconfig.seed = 1234 ;
  preloadVideos(p5, vidlist)
  randomVideo(p5)
  console.log(p5.vidconfig)

}

