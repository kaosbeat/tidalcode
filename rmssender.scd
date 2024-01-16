(
// Run this to start sending the RMS OSC messages to SC.
~dirt.startSendRMS;

// The bridge will be listening to OSC messages on port UDP 9130.
b = NetAddr.new("192.168.1.166", 9130);

// This is the RMS OSC handler, here we'll forward these messages to our bridge
OSCFunc({ |msg|
	// Forward OSC message
	b.sendMsg("/rms", *msg);
}, "/rms");
)