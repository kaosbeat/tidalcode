
/// run this after makiing sure
~rmsviz = MIDIOut(5);


// Run this to start sending the RMS OSC messages to SC.
~dirt.startSendRMS;



(
f = { |msg, time, addr|
    if(msg[0] == '/rms') {
		var o = msg[2];
		var basenote = 64;
		var note = 0;
		var vol = (msg[4] + msg[6]);
		var voltresh = 0;
		if (o < 8) {
			voltresh = vol*40;
			i = 0;
			while { i < 8} {
				note = basenote + o + (i*8);
				if (i < voltresh) {
					~rmsviz.noteOn(9,note,5);
				} {
					~rmsviz.noteOff(9,note,5);
				};
				i = i + 1;
			};
		}
	}
};


);

thisProcess.addOSCRecvFunc(f);





thisProcess.removeOSCRecvFunc(f);

