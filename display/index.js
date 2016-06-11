var raf = require('raf')

var canvas = document.createElement('canvas')
canvas.width = 600
canvas.height = 800
canvas.style.backgroundColor = '#000000'
document.body.appendChild(canvas)

var context = canvas.getContext('2d');

drawPolygon = function (context, points, props) {
  if (props.fill || props.stroke) {
    if (props.shadow) {
      context.shadowBlur = props.shadow.size
      context.shadowColor = props.shadow.color
    }
    context.beginPath()
    context.lineCap = 'round'
    points.forEach(function (xy) {
      context.lineTo(xy[0], xy[1])
    })
    //context.closePath()
    context.lineWidth = props.thickness || 1
    context.fillStyle = props.fill
    context.strokeStyle = props.stroke
    if (props.stroke) context.stroke()
    if (props.fill) context.fill()
    if (props.shadow) {
      context.shadowBlur = 0
    }
  }
}

function scale(canvas, points) {
  width = 75.6
  height = 95.4 
  return points.map(function (xy) {
    return [xy[0]/width*canvas.width/2*0.90 + canvas.width / 2, 0.9625*canvas.height - 0.925*xy[1]/height*canvas.height]
  })
}

function move(player) {
  return player.points.map(function (xy) {
    return [xy[0] + player.position[0], xy[1] + player.position[1]]
  })
}

var map
var player
var start

raf(function tick() {
  map = require('electron').remote.getGlobal('map')
  player = require('electron').remote.getGlobal('player')

  context.clearRect(0, 0, canvas.width, canvas.height);
  drawPolygon(context, scale(canvas, map.area), {
    fill: '#D6D0C4',
  })

  drawPolygon(context, scale(canvas, map.borders[0]), {
    stroke: '#5e5e5e',
    thickness: 7,
  })

  drawPolygon(context, scale(canvas, map.borders[1]), {
    stroke: '#5e5e5e',
    thickness: 7,
  })

  drawPolygon(context, scale(canvas, map.triggers[0]), {
    fill: '#17B2E6',
  })

  drawPolygon(context, scale(canvas, move(player)), {
    fill: '#AB051E',
  })

  player.hit.forEach(function (el) {
    el.forEach(function (el, i, ar) {
      drawPolygon(context, scale(canvas, [el.start, el.intersection]), {
        stroke: '#AB051E',
        thickness: 2,
      })    
    })
  })

  raf(tick)
})