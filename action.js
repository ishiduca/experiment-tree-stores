var inherits = require('inherits')
var xtend    = require('xtend')
var mutable  = require('xtend/mutable')
var Observer = require('./lib/observer')

inherits(Action, Observer)
module.exports = Action

function Action (label, _opt, _role) {
    if (!(this instanceof Action)) return new Action(label, _opt, _role) 
    Observer.call(this)
    this.label = label
    this.opt   = xtend(_opt)
    _role && mutable(this, _role)
}

Action.prototype._publish = function (data) {
    this.publish({
        label: this.label
      , value: data
    })
}

Action.prototype.error = function (err) {
    this.handleError(err)
}

Action.prototype.handleError = function (err) {
    throw new Error('".handleError" has not been implemented')
}

Action.prototype.addHandleError = function (handleError) {
    this.handleError = handleError
}
