
# tidalcode
Adapt BootTidal.hs per machine

dzs
# Visual Studio Code 
## tidal config
- point to correct `BootTidal.hs`
- more info https://tidalcycles.org/docs/configuration/boot-tidal/
## APC config transparency
- copy setup/apcsettings.json to extensions > APC settings  edit in settings.json for transparency, also `run sudo chown -R $(whoami) /usr/share/code` on every vscode update


## fontcofig
Ctrl-shift-P  "per language settings"


```json
    "files.associations": {
        "*.tidal": "haskell"
    },
    "[haskell]": {
    
        "editor.fontFamily": "'Press Start 2P',PC Senior,'Terminus (TTF)','Droid Sans Mono', 'monospace', monospace"
    },
    "tidalcycles.feedbackColor": "rgba(255,250,100,0.3)",
    "theme-by-language.themes": {
      "*": "Default Dark Modern",
      "haskell": "Hackers Haze"
    },
```