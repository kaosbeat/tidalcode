// Evaluate the block below to start the mapping MIDI -> OSC.
(
var on, off, cc;
var osc, midimon;

osc = NetAddr.new("127.0.0.1", 6010);
midimon = NetAddr.new("127.0.0.1", 6011);


// MIDIClient.init;

MIDIIn.connectAll;

on = MIDIFunc.noteOn({ |val, num, chan, src|
	osc.sendMsg("/ctrl", num.asString, val/127);
});

off = MIDIFunc.noteOff({ |val, num, chan, src|
	osc.sendMsg("/ctrl", num.asString, 0);
});



/*
cc = MIDIFunc.cc({ |val, num, chan, src|
	osc.sendMsg("/ctrl", num.asString, val/127);
});*/

~divs = [0, 1, 2, 4, 8, 16, 32, 64];
~lastSendTime = 0;
~lastVal = nil;
~throttleTime = 0.02;

cc = MIDIFunc.cc({ |val, num, chan, src|
	var divindex, divs, smallint, normalfloat, lpfv, currentTime;
	currentTime = Main.elapsedTime;
	normalfloat = val/127;
	smallint = ((val / 8) ).floor.asInteger;
	divindex = (val / 16).floor.asInteger;
	divindex = divindex.clip(0, 7);  // Safety: Ensure the index never goes outside the bounds of our list (0 to 3)
	divs = ~divs[divindex];
	lpfv = (val/127*1000)+200;
	osc.sendMsg("/ctrl", num.asString, normalfloat);
	// osc.sendMsg("/ctrl", "p" ++ num.asString, (val / 5) + 1);
	osc.sendMsg("/ctrl", "i" ++ num.asString, smallint);
	osc.sendMsg("/ctrl", "d" ++ num.asString, divs);
	osc.sendMsg("/ctrl", "lpf" ++ num.asString, lpfv);
	"MIDI Value: % -> Mapped Value d: %".format(val, divs).postln;
	"MIDI Value: % -> Mapped Value i: %".format(val, ((val / 8)).floor.asInteger;).postln;
	if((val != ~lastVal) && ((currentTime - ~lastSendTime) > ~throttleTime)) {
		~lastVal = val;
		~lastSendTime = currentTime;
		midimon.sendMsg("/midimon", num.asString, val, normalfloat, smallint, divs);
	};
});



if (~stopMidiToOsc != nil, {
	~stopMidiToOsc.value;
});

~stopMidiToOsc = {
	on.free;
	off.free;
	cc.free;
};
)

// Evaluate the line below to stop it.
// ~stopMidiToOsc.value;