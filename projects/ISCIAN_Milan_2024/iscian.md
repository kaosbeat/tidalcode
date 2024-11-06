# hardware list
- AudioHUB
- AIBox
- OP1 as midi controller
- bluebox mix
- OPZ trigger (Program 8 _ track 1 gives trigger out)

# start AI backend or  not
## term 1
cd stable-diffusion-webui/
./webui.sh  --opt-channelslast --opt-sdp-attention --medvram-sdxl  --cors-allow-origins=http://localhost:7860/  --api   --listen


## term2
cd /home/kaos/Documents/kaotec/infinitePanorama/server
python server.py


## term3
cd /home/kaos/Documents/kaotec/infinitePanorama/web
python -m http.server 8002


# start visuals



cd /opt/hydra-osc
node server.js &
cd /opt/hydra
yarn serve &




# start supercollider
pw-jack scide

# start video recording?
flatpak run com.dec05eba.gpu_screen_recorder
