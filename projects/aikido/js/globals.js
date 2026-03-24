let baseURL = "http://modrock.local:5001"
let dataURL = "http://localhost:5556"

let imageurl = 'https://localhost:5001/testdata/texture.png';

let appprefix ="performjs"
let appdata = "performdata.json"



//state
let localdata;
let loadedartists = []
let currentartist = ""
let loadedcollections = []
// let currentsubcollection = ""
let loadedcollectionnames = []
let collectionname = ""
let currentfx = "clean"
let currentdriver = "midinotes" // "midiclock"? "audio?"
let showcode = 0 // 0 = off, 1 = in fx layer, 2 = on top
let showdata = 0 // 0 = off, 1 = in fx layer, 2 = on top

let ww = window.innerWidth
let wh = window.innerHeight
let wg = ww/10 // widthgrid
let hg = wh/10
let debugA, debugB
/// image
let imgbuffer;
let imgdataset = [];
let img;
/// 3D stuff
let obj3Dbuffer;
let obj3Ddataset = []
let objtexdataset = []
let obj;
let textr;
/// P5 stuff


// metadata
let metadataset = [];
let metadata = {"title" : "loading", "materials" : ["loading"], "colors" : []}
// db stuff
let db;


//hydra
let fxpipe = [ ] // hydrastuff
let hydracount = 0
let hydratexture = false
//interfacestuf
let jitter = 5;
let posx = 0
let posy = 0
let info = ["_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_",]
let p5vars = {
    "p1" : 0.5,
    "p2" : 0.5,
    "p3" : 0.5,
    "p4" : 0.5,
    "s0" : true,
    "s1" : true,
    "s2" : true,
    "s3" : true,
    'rotx': 0,
    'roty': 0,
    'rotz': 0,
    'posx': 0,
    'posy': 0,
    'posz': 0,
    'overlay': true,
    'globalalpha': 256,
    'localalpha': { 
                'a0' : 0,
                'a1' : 0,
                'a2' : 0,
                'a3' : 0,
                'a4' : 0,
                'a5' : 0,
                'a6' : 0,
                'a7' : 0,
                'a8' : 0,
                'a9' : 0,
                'a10' : 0,
                'a11' : 0,
                'a12' : 0,
                'a13' : 0,
                'a14' : 0,
                'a15' : 0,
                'a16' : 0,
                'a17' : 0,
                'a18' : 0,
                'a19' : 0,
                'a20' : 0,
                'a21' : 0,
                'a22' : 0,
                'a23' : 0,
                'a24' : 0,
                'a25' : 0,
                'a26' : 0,
                'a27' : 0,
            },
    'controls': {   'cc0' : 0,
                    'cc1' : 0,
                    'cc2' : 0,
                    'cc3' : 0,
                    'cc4' : 0,
                    'cc5' : 0,
                    'cc6' : 0,
                    'cc7' : 0,
                    'cc8' : 0,
                    'cc9' : 0,
                    'cc10' : 0,
                    'cc11' : 0,
                    'cc12' : 0,
                    'cc13' : 0,
                    'cc14' : 0,
                    'cc15' : 0,
                    'cc16' : 0,
                    'cc17' : 0,
                    'cc18' : 0,
                    'cc19' : 0,
                    'cc20' : 0,
                    'cc21' : 0,
                    'cc22' : 0,
                    'cc23' : 0,
                    'cc24' : 0,
                    'cc25' : 0,
                    'cc26' : 0,
                    'cc27' : 0
                },
    'currentControl' : 'cc15',
    'primary': "loading",
    'secondary': 'laoding',
    'currentdata': 'dmgtype',
    'currentsubcollection': "",
    'dmgcolor' : 'loading',
    'dmgtype': 'loading',
    'dmgmaterial': 'loading',
    'currentFX': 1,
    'fxpipe': 'kaotec []<>',
    'enablemidi': [],
    'cubes': "initializing",
    'lines': "initializing",
    'rects': "initializing",
    'textparts': "initializing",
    'coll2D': "initializing",
    'coll3D': "initializing",
    'message' : 'play with Design Museam Ghent Data'
    
}
let font;
let basesize = 12;
// let interfaceAlpha = 256;

