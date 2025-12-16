~lc = LinkClock.new.latency_(Server.default.latency);

~lc.numPeers;

~ltmc = LinkToMidiClock(~scOut, ~lc)

~ltmc2 = LinkToMidiClock(~axoOut, ~lc)


~ltmc.start

~ltmc2.start


~ltmc2.stop


Link