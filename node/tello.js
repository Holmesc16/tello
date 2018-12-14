const dgram = require('dgram')  // interacts with UDP on Node
const wait = require('waait')   // sets "timeout" for cxn to drone
const commandDelays = require('./commandDelays')

const PORT = 8889               //connect via wifi
const HOST = '192.168.10.1'

const drone = dgram.createSocket('udp4')    //creates socket cxn via udp4 protocol
drone.bind(PORT)

drone.on('message', message => {
    console.log(`🤣 : ${message}`)
})
 
function errorHandler(err) {
    if(err) {
        console.log('Error', err)
    }
}
//drone.send('command', 0, 7, PORT, HOST, errorHandler) //init cmd for cxn to drone - reqd for all successive commands
// drone.send('battery?', 0, 8, PORT, HOST, errorHandler)

const commands = ['command', 'battery?', 'takeoff', 'land']

let i = 0

async function go() {
    const command = commands[i]
    const delay = commandDelays[command]
    console.log(`currently running command: ${command}`)
    drone.send(command, 0, command.length, PORT, HOST, errorHandler)
    await wait(delay)
    i += 1
    if(i < commands.length) return go();
    console.log('se acabó')
}

go();