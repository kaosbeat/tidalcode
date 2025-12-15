/// install https://tidalcycles.org/docs/configuration/MIDIOSC/midi/#synchronising-midi-clock in

// Platform.systemExtensionDir;


~lc = LinkClock.new.latency_(Server.default.latency);

~lc.numPeers;

~ltmc = LinkToMidiClock(~scOut, ~lc);

~ltmc2 = LinkToMidiClock(~axoOut, ~lc);

/*(
~lmtc.stop;
~lmtc2.stop;
)*/

~ltmc.start;
~ltmc2.start;
