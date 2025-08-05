## record with tidal looper
once $ s "looper" # lname "tloop" # n "2"


## persist files from supercollider
~looper.persistLoops(~lname = "tloop")


## mv loops into tidalsamplesdir