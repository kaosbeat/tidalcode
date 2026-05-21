// Quarks.install("crucial-library");
// Quarks.gui;
MIDIClient.disposeClient;

MIDIClient.init;


MIDIClient.destinations;
(
// MIDIClient.init;



// ~open303 = MIDIOut.newByName("Virtual Raw MIDI 2-0", "VirMIDI 2-0");
~open303 = MIDIOut(0);
~dirt.soundLibrary.addMIDI(\op3, ~open303);


~bal =  MIDIOut(1);
~dirt.soundLibrary.addMIDI(\bal, ~bal);


~md2 =  MIDIOut(2);
~dirt.soundLibrary.addMIDI(\md2, ~md2);

~md3 =  MIDIOut(3);
~dirt.soundLibrary.addMIDI(\md3, ~md3);


~reaperClock =  MIDIOut(4);
~dirt.soundLibrary.addMIDI(\reaperclock, ~reaperClock);

// ~dirt.soundLibrary.addMIDI(\, ~midiOut);
// ~midiOut.latency = 0.0; /// zoptional latency

// ~dirt.soundLibrary.addMIDI(\md3, ~md3);
/*
~renoiseOut = MIDIOut.newByName("Renoise MIDI Input", "Renoise MIDI In Port A");
~dirt.soundLibrary.addMIDI(\rmidi, ~renoiseOut);*/

// ~wledmidiOut = MIDIOut.newByName("R/*tMidiIn Client", "Virtual MIDI input")
// ~wledmidiOut = MIDIOut.newByName("Midi Through", "Midi Through Port-0");
// ~dirt.soundLibrary.addMIDI(\wled, ~wledmidiOut);
// ~wledmidiOut.latency = 0.0;  /// optional latency


~midiOut = MIDIOut.newByName("Midi Through", "Midi Through Port-0");
~dirt.soundLibrary.addMIDI(\midi, ~midiOut);
~midiOut.latency = 0.0; /// zoptional latency
//
// ~td3Out = MIDIOut.newByName("TD-3", "TD-3 MIDI 1");
// ~dirt.soundLibrary.addMIDI(\td3, ~td3Out);
// ~td3Out.latency = 0.0; /// optional latency
//
// ~op1Out = MIDIOut.newByName("OP-1", "OP-1 MIDI 1");
// ~dirt.soundLibrary.addMIDI(\op1, ~op1Out);
// ~op1Out.latency = 0.0;  /// optional latency
//
// //
// ~axoOut = MIDIOut.newByName("Axoloti Core", "Axoloti Core");
// ~dirt.soundLibrary.addMIDI(\axo, ~axoOut);
//
//
// ~opzOut = MIDIOut.newByName("OP-Z", "OP-Z MIDI 1");
// ~dirt.soundLibrary.addMIDI(\opz, ~opzOut);
// // ~opzOut.latency = 0.05;  /// optional latency
// //
// ~monoOut = MIDIOut.newByName("Circuit Mono Station", "Circuit Mono Station MIDI 1");
// ~dirt.soundLibrary.addMIDI(\mono, ~monoOut);

// ~ocOut = MIDIOut.newByName("Teensy MIDI", "Teensy MIDI MIDI 1");
// ~dirt.soundLibrary.addMIDI(\onc, ~ocOut);
// ~ocOut.latency = 0.02;  /// optional latency

// ~dexOut = MIDIOut.newByName("Midi Through", "Midi Through Port-0");
// ~dirt.soundLibrary.addMIDI(\dx7, ~dexOut);



// ~monOut = MIDIOut.newByName("Protokol", "Protokol")
// ~dirt.soundLibrary.addMIDI(\mon, ~monOut);

// ~midiOut.latency = 0;  /// optional latency


// ~lc = LinkClock.new.latency_(Server.default.latency);
// ~mc = MIDIClockOut("Axoloti Core", "Axoloti Core Axoloti Core", ~lc);
// ~mc = MIDIClockOut("Protokol", "Protokol", ~lc);
// ~mc.play;

)
