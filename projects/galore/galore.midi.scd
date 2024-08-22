MIDIClient.init;
(

~ocOut = MIDIOut.newByName("Teensy MIDI", "Teensy MIDI MIDI 1");
~dirt.soundLibrary.addMIDI(\onc, ~ocOut);
~ocOut.latency = 0.02;  /// optional latency

~opzOut = MIDIOut.newByName("OP-Z", "OP-Z MIDI 1");
~dirt.soundLibrary.addMIDI(\opz, ~opzOut);
~opzOut.latency = 0.0;  /// optional latency
//


//
//~pfm2Out = MIDIOut.newByName("PreenFM mk2", "PreenFM mk2 MIDI 1");
//~dirt.soundLibrary.addMIDI(\pfm2, ~pfm2Out);
//~pfm2Out.latency = 0.05;  /// optional latency


)