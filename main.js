var electron = require('electron')
var controller = require('crtrdg-tty')()
var Freemove = require('./freemove.js')
var distance = require('ray-to-lines')

electron.app.on('ready', function () {
  var mainWindow = new electron.BrowserWindow({
    width: 600,
    height: 800,
    resizable: false,
    frame: false,
  })
  
  // In the main process.
  global.map = {
    area: [[-15, 0], [-15, 20], [-45.2, 47.7], [-45.2, 57.7],
      [-15.3, 57.7], [-15.3, 47.7], [0, 33.7], [15.3, 47.7], [15.3, 57.7],
      [-15, 85.4], [-15, 95.4], [15, 95.4], [15, 85.4], [30.3, 71.4],
      [45.6, 85.4], [45.6, 95.4], [75.6, 95.4], [75.6, 85.4], [45.3, 57.7],
      [45.3, 47.7], [15, 20], [15, 0], [-15, 0]],
    borders: [
      [[-15, 0], [-15, 20], [-45.2, 47.7], [-45.2, 57.7],
        [-15.3, 57.7], [-15.3, 47.7], [0, 33.7], [15.3, 47.7], [15.3, 57.7],
        [-15, 85.4], [-15, 95.4]],
      [[15, 95.4], [15, 85.4], [30.3, 71.4], [45.6, 85.4], [45.6, 95.4],
        [75.6, 95.4], [75.6, 85.4], [45.3, 57.7],
        [45.3, 47.7], [15, 20], [15, 0]]
      ],
    links: [
        [[-15, 95.4], [15, 95.4]], [[-15, 0], [15, 0]],
      ],
    triggers: [
      [[4.7, 72.8], [-7.5, 84], [10.5, 84], [22.7, 72.8]]
    ],
  }

  global.player = {
    position: [0, 5],
    points: [[-2,-1.5], [0, 1.5], [2, -1.5]],
    movement: new Freemove({
      keymap: ['<left>', '<right>', '<up>', '<down>'],
      translation: [[-1, 1, 0, 0], [0, 0, 1, -1]]
    }),
    hit: [],
  }

  function move(position, delta, map){
      // do collision detection
      

      
      // do link crossing
      position[0] += delta[0]
      position[1] += delta[1]

    return position
  }

  console.log('start')

var input
var delta
var ray
var hit
var link
var angles = [0, 90, 180]

  setInterval(function() {
    input = controller.keysDown
    delta = global.player.movement.compute(input, 0).translation
    delta[0] = delta[0]*.1
    delta[1] = delta[1]*.1
    global.player.position = move(global.player.position, delta, map)
    
    // measure distances to obstacles
    angles.forEach(function (ang, i) {
      hit = distance(global.player.position, ang, global.map.borders)
      link = distance(global.player.position, ang, global.map.links)
      if (hit.distance > link.distance) {
        if (link.id%2==0){
          start = [link.intersection[0] - (global.map.links[link.id][0][0] - global.map.links[link.id+1][0][0]), link.intersection[1] - (global.map.links[link.id][0][1] - global.map.links[link.id+1][0][1])]
        } else {
          start = [link.intersection[0] - (global.map.links[link.id][0][0] - global.map.links[link.id-1][0][0]), link.intersection[1] - (global.map.links[link.id][0][1] - global.map.links[link.id-1][0][1])]
        }
        global.player.hit[i] = [link, distance(start, ang, global.map.borders)]
      } else {
        global.player.hit[i] = [hit]      
      }
    })
  }, 10)

// make ray to lines ---- for distance to collection of line segments from a point in a direction
// have to patch distance around links if those are the smallest hits .....

  mainWindow.loadURL('file://' + __dirname + '/display/index.html')
  //mainWindow.webContents.openDevTools()
})