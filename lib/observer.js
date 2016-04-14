module.exports = Observer

function Observer () {
    this.subs = []
}

Observer.prototype.publish = function () {
    var args = [].slice.apply(arguments)
    for (var i = 0; i < this.subs.length; i++) {
        this.subs[i].apply(null, args)
    }
}

Observer.prototype.subscribe = function (sub) {
    return ('function' === typeof sub) ? !!(this.subs.push(sub)) : false
}

Observer.prototype.unsubscribe = function (sub) {
    this.subs = ('undefined' === typeof sub || null === sub)
        ? [] : this.subs.filter(function (_sub) {return _sub !== sub})
    return sub
}

Observer.prototype.once = function (sub) {
    var me = this
    function wrap () {
        sub.apply(null, arguments)
        me.unsubscribe(wrap)
    }
    this.subscribe(wrap)
}
