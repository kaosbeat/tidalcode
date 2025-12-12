#!/bin/bash
echo "starting algorave on kaosfury"

cd /opt/hydra/frontend/web-editor/public 
rm hydra
ln -s /home/kaos/livecode/tidalcode/projects/frigo/hydra/ .
ln -s /home/kaos/livecode/tidalcode/img .


# pw-jack scide &
# cd /opt/hydra-osc
# node server.js &
cd /opt/hydra
yarn serve&
/opt/chrome-linux/chrome --url="https://localhost:8000" --start-fullscreen &
# cd /home/kaos/livecoding/tidalcode
# code .
qpwgraph

echo " connect yellowbox midi (modrock) to chromium"

# flatpak run com.dec05eba.gpu_screen_recorder





