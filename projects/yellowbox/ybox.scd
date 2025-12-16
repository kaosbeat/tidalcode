
MIDIClient.disposeClient();

MIDIClient.init;



//
/*~ocOut = MIDIOut.newByName("Teensy MIDI", "Teensy MIDI MIDI 1");
~dirt.soundLibrary.addMIDI(\onc, ~ocOut);
~ocOut.latency = 0.0;  /// optional latency*/

~scOut = MIDIOut.newByName("S&C 04E9E51758E3", "S&C 04E9E51758E3 MIDI 1");
~dirt.soundLibrary.addMIDI(\snc, ~scOut);
~scOut.latency = 0.04;  /// optional latency

~axoOut = MIDIOut.newByName("Axoloti Core", "Axoloti Core Axoloti Core");
~dirt.soundLibrary.addMIDI(\axo, ~axoOut);
~axoOut.latency = 0.06;

~midiOut = MIDIOut.newByName("Midi Through", "Midi Through Port-0");
~dirt.soundLibrary.addMIDI(\midi, ~midiOut);
~midiOut.latency = 0.0; /// optional latency

// ~midiOut = MIDIOut.newByName("Midi Through", "Midi Through Port-0");
~dirt.soundLibrary.addMIDI(\wled, ~midiOut);
// ~midiOut.latency = 0.0; /// optional latency


/*~op1Out = MIDIOut.newByName("OP-1", "OP-1 MIDI 1");
~dirt.soundLibrary.addMIDI(\op1, ~op1Out);
~op1Out.latency = 0.0; /// optional latency*/

		// ~opzOut = MIDIOut.newByName("OP-Z", "OP-Z MIDI 1");
		// ~dirt.soundLibrary.addMIDI(\opz, ~opzOut);
		// ~opzOut.latency = 0.0;

~pfm2Out = MIDIOut.newByName("PreenFM mk2", "PreenFM mk2 MIDI 1");
~dirt.soundLibrary.addMIDI(\pfm2, ~pfm2Out);
~pfm2Out.latency = 0.05;  /// optional latency