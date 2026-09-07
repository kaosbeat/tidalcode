// Evaluate the block below to start the mapping MIDI -> OSC.
(
var on, off, cc;
var osc;

osc = NetAddr.new("127.0.0.1", 6010);

MIDIClient.init;
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



cc = MIDIFunc.cc({ |val, num, chan, src|
	var divindex, divs;
	divindex = (val / 16).floor;
	divindex = divindex.clip(0, 7);  // Safety: Ensure the index never goes outside the bounds of our list (0 to 3)
	divs = ~divs[divindex];
	osc.sendMsg("/ctrl", num.asString, val/127);
	// osc.sendMsg("/ctrl", "p" ++ num.asString, (val / 5) + 1);
	osc.sendMsg("/ctrl", "i" ++ num.asString, ((val / 8) + 1).floor;);
	osc.sendMsg("/ctrl", "d" ++ num.asString, divs);
	"MIDI Value: % -> Mapped Value d: %".format(val, divs).postln;
	"MIDI Value: % -> Mapped Value i: %".format(val, ((val / 8) + 1).floor;).postln;
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
~stopMidiToOsc.value;