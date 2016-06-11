var _ = require('lodash')

function Freemove (opts) {
  opts = opts || {}
  _.defaults(opts, {
    keymap: ['<left>', '<right>', '<up>', '<down>'],
    translation: [[-1, 1, 0, 0], [0, 0, -1, 1]],
    friction: 0.1
  })
  _.defaults(opts, {
    rotation: _.fill(Array(opts.keymap.length), 0),
    scale: _.fill(Array(opts.keymap.length), 0),
  })
  _.assign(this, opts)
  this.velocity = {translation: [0, 0], rotation: 0, scale: 0}
}

Freemove.prototype.compute = function (keys, rotation) {
  var self = this
  self.keymap.forEach(function (key, i) {
    if (keys[key]) {
      self.velocity.translation[0] += self.translation[0][i]
      self.velocity.translation[1] += self.translation[1][i]
      self.velocity.rotation += self.rotation[i]
      self.velocity.scale += self.scale[i]
    }
  })

  var delta = self.delta(rotation)
  if (self.friction < 1) self.dampen()
  return delta
}

Freemove.prototype.delta = function (rotation) {
  var rad = rotation * Math.PI / 180 || 0
  return {
    translation: [
      this.velocity.translation[0] * Math.cos(rad) - this.velocity.translation[1] * Math.sin(rad),
      this.velocity.translation[0] * Math.sin(rad) + this.velocity.translation[1] * Math.cos(rad)
    ],
    rotation: this.velocity.rotation,
    scale: Math.exp(this.velocity.scale)
  }
}

Freemove.prototype.dampen = function () {
  this.velocity.translation[0] *= this.friction
  this.velocity.translation[1] *= this.friction
  this.velocity.rotation *= this.friction
  this.velocity.scale *= this.friction
}

module.exports = Freemove
