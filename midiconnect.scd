// Quarks.install("crucial-library");
MIDIClient.init;
(
MIDIClient.init;

// ~midiOut = MIDIOut.newByName("Axoloti Core", "Axoloti Core Axoloti Core");
~midiOut = MIDIOut.newByName("Midi Through", "Midi Through Port-0");
~dirt.soundLibrary.addMIDI(\midi, ~midiOut);


// ~midiOut = MIDIOut.newByName("Axoloti Core", "Axoloti Core Axoloti Core");
~opzOut = MIDIOut.newByName("OP-Z", "OP-Z MIDI 1");
~dirt.soundLibrary.addMIDI(\opz, ~opzOut);
//
// ~monoOut = MIDIOut.newByName("Circuit Mono Station", "Circuit Mono Station MIDI 1");
// ~dirt.soundLibrary.addMIDI(\mono, ~monoOut);


~dexOut = MIDIOut.newByName("Midi Through", "Midi Through Port-0");
~dirt.soundLibrary.addMIDI(\dx7, ~dexOut);


~pfm2Out = MIDIOut.newByName("PreenFM mk2", "PreenFM mk2 MIDI 1");
~dirt.soundLibrary.addMIDI(\pfm2, ~pfm2Out);

~midiOut.latency = 0;  /// optional latency
// ~midiOut.latency = 0.45;  /// optional latency


// ~lc = LinkClock.new.latency_(Server.default.latency);
// ~mc = MIDIClockOut("Axoloti Core", "Axoloti Core Axoloti Core", ~lc);
// ~mc = MIDIClockOut("Protokol", "Protokol", ~lc);
// ~mc.play;

)

~midiOut.latency = 0;