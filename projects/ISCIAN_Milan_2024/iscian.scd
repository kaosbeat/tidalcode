MIDIClient.init;


(
//
// ~ocOut = MIDIOut.newByName("Teensy MIDI", "Teensy MIDI MIDI 1");
// ~dirt.soundLibrary.addMIDI(\onc, ~ocOut);
// ~ocOut.latency = 0.05;  /// optional latency


~midiOut = MIDIOut.newByName("Midi Through", "Midi Through Port-0");
~dirt.soundLibrary.addMIDI(\midi, ~midiOut);
~midiOut.latency = 0.0; /// optional latency

~op1Out = MIDIOut.newByName("OP-1", "OP-1 MIDI 1");
~dirt.soundLibrary.addMIDI(\op1, ~op1Out);
~op1Out.latency = 0.0; /// optional latency

~opzOut = MIDIOut.newByName("OP-Z", "OP-Z MIDI 1");
~dirt.soundLibrary.addMIDI(\opz, ~opzOut);
~opzOut.latency = 0.0;
)




(
	SynthDef(\acid309, {|out, sustain= 1, pan, accelerate, freq |
	 	var env1, env2, son, pitch, amp, gate;
	    gate=1;
	    amp = 0.5;
		pitch = freq.cpsmidi;
		pitch = Lag.kr(pitch, 0.12 * (1-Trig.kr(gate, 0.001)) * gate);
		env1 = EnvGen.ar(Env.new([0, 1.0, 0, 0], [0.001, 2.0, 0.04], [0, -4, -4], 2), gate, amp, doneAction:2);
		env2 = EnvGen.ar(Env.adsr(0.001, 0.8, 0, 0.8, 70, -4), gate);
		son = LFPulse.ar(pitch.midicps, 0.0, 0.51, 2, -1);

		son = RLPF.ar(son, (pitch + env2).midicps, 0.3);

	    OffsetOut.ar(out, DirtPan.ar(son, ~dirt.numChannels, pan, env1));
	}).add;


SynthDef(\ultrasaw, {
	|out, sustain = 1, freq = 440, speed = 1, begin=0, end=1, pan, accelerate, offset|
	var line = Line.ar(begin, end, sustain, doneAction:2);
	var env = Env([0,1,1,0],[0.001,1,0.001]);
	var envGen = IEnvGen.ar(env, line*env.times.sum*abs(speed));
	var freqs = {Rand(-1,1)*(freq/60)}.dup(12);
	var sound = Saw.ar((freq+freqs));
	sound = sound + Saw.ar((freq+freqs)*2);
	sound = sound + Saw.ar((freq+freqs)*0.5);
	sound = sound + Saw.ar((freq+freqs)*4);
	sound = sound + Saw.ar((freq+freqs)*0.25);
	sound = LPF.ar(sound, freq*1.5);
	//sound = RLPF.ar(sound, Clip.ar(envGen*freq*48, 0, 20000), 0.5);
	Out.ar(out, DirtPan.ar(sound, ~dirt.numChannels, pan, envGen));
}).add;

)

