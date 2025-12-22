

/* OSC COMMUNICATION */
function receiveOsc(address, value) {
	// debug received message
	// print('in: ' + address + ', ' +value)
	if(debugIn) {
		debugIn.value(address + ', ' + value)
	}
    if (address == "/imgurl"){
        imageurl = value;
    }


}

function sendOsc(address, value) {
	if(socket != undefined) {
		socket.emit('message', [address].concat(value))
	}

	// debug sent message
	if(debugOut) {
		debugOut.value(address + ', ' + value)
	}
}

function setupOsc(oscHost, oscPortIn, oscPortOut) {
	socket = io.connect('http://127.0.0.1:8082')
	socket.on('connect', function() {
		socket.emit('config', {
			server: {
				host: oscHost,
				port: oscPortIn
			},
			client: {
				host: oscHost,
				port: oscPortOut
			}
		})
		print('OSC Ready!\n' + oscHost + ', listen: ' + oscPortIn + ', send: ' + oscPortOut)
	})
	socket.on('message', function(msg) {
		receiveOsc(msg[0], msg.splice(1))
	})
}
 
function debugBox(elm, label, x, y, w, h) {
	let telm = createDiv(label).position(x, y)
	telm.style('color', '#fff')
	telm.style('font-family', 'monospace')
	telm.style('padding', '5px')
	elm.position(x, y + 20).size(w, h).value('')
	elm.style('color', '#fff')
	elm.style('background', 'none')
	elm.style('border', '1px solid #fff')
	elm.style('resize', 'none')
	elm.style('padding', '5px')
	elm.style('outline', 'none')
}





