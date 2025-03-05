(
// Run this to start sending the RMS OSC messages to SC.
~dirt.startSendRMS;

// The bridge will be listening to OSC messages on port UDP 9130.
b = NetAddr.new("aib4.local", 9130);
// b = NetAddr.new("localhost", 9130);
// b = NetAddr.new("corekaos.local", 9130);
// This is the RMS OSC handler, here we'll forward these messages to our bridge
OSCFunc({ |msg|
	// Forward OSC message
	b.sendMsg("/rms", *msg);
}, "/rms");
)


/// trying to patch input busses into output busses to send audio to RMS
// {Out.ar(2, SoundIn.ar(1,1))}.play;
/// this does not work, instead use below script to append inputs to output RMS messages

(
{
	var rmsReplyRate = 8, rmsPeakLag = 3, replyID = 1000;
	var signal = SoundIn.ar(0,1);
	SendPeakRMS.kr(signal, replyRate: rmsReplyRate, peakLag: rmsPeakLag, cmdName:"/rms", replyID: replyID)
}.play(target: ~dirt.group, addAction: \addToTail);

{
	var rmsReplyRate = 8, rmsPeakLag = 3, replyID = 1001;
	var signal = SoundIn.ar(1,1);
	SendPeakRMS.kr(signal, replyRate: rmsReplyRate, peakLag: rmsPeakLag, cmdName:"/rms", replyID: replyID)
}.play(target: ~dirt.group, addAction: \addToTail);

{
	var rmsReplyRate = 8, rmsPeakLag = 3, replyID = 1002;
	var signal = SoundIn.ar(2,1);
	// var signal = SoundIn.ar([6,7],1);
	SendPeakRMS.kr(signal, replyRate: rmsReplyRate, peakLag: rmsPeakLag, cmdName:"/rms", replyID: replyID)
}.play(target: ~dirt.group, addAction: \addToTail);

{
	var rmsReplyRate = 8, rmsPeakLag = 3, replyID = 1003;
	var signal = SoundIn.ar(3,1);
	SendPeakRMS.kr(signal, replyRate: rmsReplyRate, peakLag: rmsPeakLag, cmdName:"/rms", replyID: replyID)
}.play(target: ~dirt.group, addAction: \addToTail);

{
	var rmsReplyRate = 8, rmsPeakLag = 3, replyID = 1004;
	var signal = SoundIn.ar(4,1);
	SendPeakRMS.kr(signal, replyRate: rmsReplyRate, peakLag: rmsPeakLag, cmdName:"/rms", replyID: replyID)
}.play(target: ~dirt.group, addAction: \addToTail);

{
	var rmsReplyRate = 8, rmsPeakLag = 3, replyID = 1005;
	var signal = SoundIn.ar(5,1);
	SendPeakRMS.kr(signal, replyRate: rmsReplyRate, peakLag: rmsPeakLag, cmdName:"/rms", replyID: replyID)
}.play(target: ~dirt.group, addAction: \addToTail);

{
	var rmsReplyRate = 8, rmsPeakLag = 3, replyID = 1006;
	var signal = SoundIn.ar(6,1);
	// var signal = SoundIn.ar([6,7],1);
	SendPeakRMS.kr(signal, replyRate: rmsReplyRate, peakLag: rmsPeakLag, cmdName:"/rms", replyID: replyID)
}.play(target: ~dirt.group, addAction: \addToTail);

{
	var rmsReplyRate = 8, rmsPeakLag = 3, replyID = 1007;
	var signal = SoundIn.ar(7,1);
	SendPeakRMS.kr(signal, replyRate: rmsReplyRate, peakLag: rmsPeakLag, cmdName:"/rms", replyID: replyID)
}.play(target: ~dirt.group, addAction: \addToTail);
)