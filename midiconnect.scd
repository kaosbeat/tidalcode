// Quarks.install("crucial-library");

(
MIDIClient.init;

~midiOut = MIDIOut.newByName("Axoloti Core", "Axoloti Core Axoloti Core");
// ~midiOut = MIDIOut.newByName("OP-Z", "OP-Z MIDI 1")
~dirt.soundLibrary.addMIDI(\midi, ~midiOut);
~midiOut.latency = 0.2;  /// optional latency
// ~midiOut.latency = 0.45;  /// optional latency


// ~lc = LinkClock.new.latency_(Server.default.latency);
// ~mc = MIDIClockOut("Axoloti Core", "Axoloti Core Axoloti Core", ~lc);
// ~mc = MIDIClockOut("Protokol", "Protokol", ~lc);
// ~mc.play;

)