var xtend     = require('xtend')
var mutable   = require('xtend/mutable')
var clone     = require('clone')
var inherits  = require('inherits')
var isEmpty   = require('is-empty')
var deepEqual = require('deep-equal')
var Observer  = require('./lib/observer')
var semaphore = require('./lib/semaphore')

inherits(Store, Observer)
module.exports = Store

function Store (initState, children, _opt, _role) {
    if (!(this instanceof Store))
        return new Store(initState, children, _opt, _role)

    Observer.call(this)
    this.children  = children
    this.state     = initState
    this.opt       = xtend(_opt)
    this.deepEqual = deepEqual
    this.semaphore = semaphore(1)
    _role && mutable(this, _role)
}

Store.prototype.getState = function getState () {
    return clone(this.state)
}

Store.prototype.setState = function setState (_state) {
    var state = xtend(this.state, _state)
    if (this.deepEqual(state, this.state)) return false

    this.state = state
    return true
}

Store.prototype.post = function post (data, _doPublishFlg) {
    var me = this
    var doPublishFlg = !! _doPublishFlg
    this.semaphore.wait(function () {
        if (isEmpty(me.children)) _work(data, me.getState())

        else {
            var state
            var n   = 0
            var len = me.children.length;
            me.children.forEach(function (store) {
                store.once(function () {
                    state = xtend(state, store.getState())
                    if ((n += 1) === len) _work(state, me.getState())
                })
                store.post(data)
            })
        }
    })

    function _work (data, state) {
        me.work(data, state, function (err, _state) {
            var isUpdated
            if (err) me.error(err)
            else (isUpdated = me.setState(_state))

            if (doPublishFlg) (isUpdated && me.publish())
            else me.publish()

            me.semaphore.signal()
        })
    }
}

Store.prototype.work = function (data, state, done) {
    throw new Error('".work" has not been implemented.')
}

Store.prototype.error = function (err) {
    this.handleError(err)
}

Store.prototype.addHandleError = function (handleError) {
    this.handleError = handleError
}
