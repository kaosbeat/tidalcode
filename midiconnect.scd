// Quarks.install("crucial-library");


MIDIClient.init;

~midiOut = MIDIOut.newByName("Axoloti Core", "Axoloti Core Axoloti Core");
~dirt.soundLibrary.addMIDI(\midi, ~midiOut);
// ~midiOut.latency = 0.45;  /// optional latency


~lc = LinkClock.new.latency_(Server.default.latency);
~mc = MIDIClockOut("Axoloti Core", "Axoloti Core Axoloti Core", ~lc);
// ~mc = MIDIClockOut("Protokol", "Protokol", ~lc);
~mc.play;