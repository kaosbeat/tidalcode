#! /usr/bin/env python3



import asyncio
from pythonosc.osc_server import AsyncIOOSCUDPServer
from pythonosc.dispatcher import Dispatcher
import rtmidi
from rtmidi.midiutil import open_midioutput
from rtmidi.midiconstants import NOTE_OFF, NOTE_ON

# midiout = rtmidi.MidiOut()
# available_ports = midiout.get_ports()
# print(available_ports)

apc0 = 'APC mini mk2:APC mini mk2 Control 28:0'
apc1 = 'APC mini mk2:APC mini mk2 Notes 28:1'


# if available_ports:
#     midiout.open_port(apc1)
#     # else:
midiout,  portname = open_midioutput(apc1)

# note_on = [NOTE_ON, 60, 112]



def send_note_on(midi_out, channel, note, velocity):
    """
    Sends a Note On message on the specified channel.

    Args:
        midi_out: The open rtmidi.open_output() port object.
        channel (int): The target channel (1-16).
        note (int): The MIDI note number (0-127).
        velocity (int): The intensity (0-127).
    """
    # 1. Calculate the status byte
    # Note On status byte is 0x9x. We use (channel - 1) for the last 4 bits.
    # Example: Channel 5 (0101) -> 0x90 | 0x04 = 0x94
    status_byte = 0x90 | (channel - 1)

    # 2. Construct the message
    # The message is a list of 3 bytes: [status, note, velocity]
    message = [status_byte, note, velocity]
    
    # 3. Send the message
    midi_out.send_message(message)

    # print(f"Sent Note On on Channel {channel}: Note {note}, Velocity {velocity}")



    # time.sleep(0.1)

soundstate = {
    "d1": 0.0,
    "d2": 0.0,
    "d3": 0.0,
    "d4": 0.0,
    "d5": 0.0,
    "d6": 0.0,
    "d7": 0.0,
    "d8": 0.0,
    }


def vumeter(soundstate):
    height = 8
    basenote = 64
    # for drawcursorY in range(height-1):
    for vu in soundstate:
        for x in range (int(soundstate[vu] * 8)):
            print(soundstate[vu])
            if (x > 5):
                color = 13 # yellow
            elif (x > 6):
                color = 5 # red
            else:
                color = 21 # green
            note = basenote + x*8        
            send_note_on(midiout, channel=10, note=note, velocity=color) 



def rms(address, *args):
    print(f"{address}: {args}")
    buffers = ["d1","d2","d3","d4","d5","d6","d7","d8"]    
    soundstate[buffers[args[2]]] = args[3]
    print(soundstate)
    soundbuffer = vumeter(soundstate)
    # ast.printMultilineonstage(soundbuffer,0, ast.lines)    
    pass


dispatcher = Dispatcher()
dispatcher.map("/rms", rms)


ip = "0.0.0.0"
port = 9130




async def loop():
    """main loop"""
    # global i, state
    # print(state)
    while True:
        # print("#waiting for data")

        await asyncio.sleep(1)
            


async def init_main():
    server = AsyncIOOSCUDPServer((ip, port), dispatcher, asyncio.get_event_loop())
    transport, protocol = await server.create_serve_endpoint()  # Create datagram endpoint and start serving
    global i
    i = 0
    await loop()  # Enter main loop of program
    transport.close()  # Clean up serve endpoint
    
    
asyncio.run(init_main())