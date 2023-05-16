// Quarks.install("crucial-library");
// Quarks.gui;
MIDIClient.init;
(
// MIDIClient.init;

// ~midiOut = MIDIOut.newByName("Axoloti Core", "Axoloti Core Axoloti Core");
~midiOut = MIDIOut.newByName("Midi Through", "Midi Through Port-0");
~dirt.soundLibrary.addMIDI(\midi, ~midiOut);
// ~midiOut.latency = 0.35;  /// optional latency


// ~midiOut = MIDIOut.newByName("Axoloti Core", "Axoloti Core Axoloti Core");
~opzOut = MIDIOut.newByName("OP-Z", "OP-Z MIDI 1");
~dirt.soundLibrary.addMIDI(\opz, ~opzOut);
~opzOut.latency = 0.05;  /// optional latency
//
// ~monoOut = MIDIOut.newByName("Circuit Mono Station", "Circuit Mono Station MIDI 1");
// ~dirt.soundLibrary.addMIDI(\mono, ~monoOut);

~ocOut = MIDIOut.newByName("Teensy MIDI", "Teensy MIDI MIDI 1");
~dirt.soundLibrary.addMIDI(\onc, ~ocOut);
~ocOut.latency = 0.02;  /// optional latency

// ~dexOut = MIDIOut.newByName("Midi Through", "Midi Through Port-0");
// ~dirt.soundLibrary.addMIDI(\dx7, ~dexOut);


~pfm2Out = MIDIOut.newByName("PreenFM mk2", "PreenFM mk2 MIDI 1");
~dirt.soundLibrary.addMIDI(\pfm2, ~pfm2Out);


// ~monOut = MIDIOut.newByName("Protokol", "Protokol")
// ~dirt.soundLibrary.addMIDI(\mon, ~monOut);

// ~midiOut.latency = 0;  /// optional latency


// ~lc = LinkClock.new.latency_(Server.default.latency);
// ~mc = MIDIClockOut("Axoloti Core", "Axoloti Core Axoloti Core", ~lc);
// ~mc = MIDIClockOut("Protokol", "Protokol", ~lc);
// ~mc.play;

)
