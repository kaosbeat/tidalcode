// Quarks.install("crucial-library");

(
MIDIClient.init;
// ~midiOut = MIDIOut.newByName("Midi Through", "Midi Through Port-0");

// ~midiOut = MIDIOut.newByName("Axoloti Core", "Axoloti Core Axoloti Core");
~opzOut = MIDIOut.newByName("OP-Z", "OP-Z MIDI 1");
~opzOut.latency = 0.042;  /// optional latency
~pfm2Out = MIDIOut.newByName("PreenFM mk2", "PreenFM mk2 MIDI 1");
~pfm2Out.latency = 0.042;  /// optional latency
~midiOut = MIDIOut.newByName("Midi Through", "Midi Through Port-0");
~dirt.soundLibrary.addMIDI(\pfm2, ~pfm2Out);
~dirt.soundLibrary.addMIDI(\midi, ~midiOut);
~dirt.soundLibrary.addMIDI(\opz, ~opzOut);
// ~midiOut.latency = 0.2;  /// optional latency
// ~midiOut.latency = 0.45;  /// optional latency


~lc = LinkClock.new.latency_(Server.default.latency);
~lc.numPeers; '0 means no connection, 1 means connection

~ltmc = LinkToMidiClock(~pfm2Out, ~lc);




// ~mc = MIDIClockOut("PreenFM mk2", "PreenFM mk2 MIDI 1", ~lc);
// ~mc = MIDIClockOut("Midi Through", "Midi Through Port-0", ~lc);

// ~mc = MIDIClockOut("Axoloti Core", "Axoloti Core Axoloti Core", ~lc);
// ~mc = MIDIClockOut("Protokol", "Protokol", ~lc);
// ~mc.play;

)