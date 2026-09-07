#!/bin/bash

fixartwiz


# --- Variables ---
PYENV_RMSAPC="my_project_env" 
SERVER_P5LIVE="npm start https"


# --- The Script ---
gnome-terminal --title "P5LIVE SERVER" -- bash -c 'cd /opt/P5LIVE ; npm start https' #!/bin/bash

pw-jack scide&

pw-jack carla /home/kaos/livecode/tidalcode/projects/grondvonk/vynsthsetup.carxp &

pw-jack reaper& 

aaaterm 'cd /home/kaos/Documents/kaotec/stardraw/ && cd midimon && python midimon.py'

qpwgraph&

# gnome-terminal --title "midimonitor"

# -- bash -c 'source ~/.pyenv/pyenv-virtualenv-init; pyenv activate ${PYENV_ENV_NAME}; ${SERVER_COMMAND}'#!/bin/bash
# gnome-titlebar
# gnome-terminal --command "bash -c 'cd /opt/P5LIVE && npm start https && read -s'"
