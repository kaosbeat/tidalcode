/// install https://tidalcycles.org/docs/configuration/MIDIOSC/midi/#synchronising-midi-clock in

Platform.systemExtensionDir;


~lc = LinkClock.new.latency_(Server.default.latency);

~lc.numPeers;

~ltmc = LinkToMidiClock(~scOut, ~lc)

~ltmc2 = LinkToMidiClock(~pfm2Out, ~lc)


~ltmc.start

~ltmc2.start