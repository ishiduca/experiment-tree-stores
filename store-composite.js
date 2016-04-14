var inherits = require('inherits')
var Store    = require('./store')

inherits(StoreComposite, Store)
module.exports = StoreComposite

function StoreComposite (label, initState, children, _opt, _role) {
    if (!(this instanceof StoreComposite))
        return new StoreComposite(label, initState, children, _opt, _role)

    Store.call(this, initState, children, _opt, _role)
    this.label = label
}

StoreComposite.prototype.post = function (payload, _doPublishFlg) {
    var me = this
    if (payload.label === this.label)
        Store.prototype.post.apply(this, [payload.value, _doPublishFlg])
    else
        this.semaphore.wait(function () {
            me.publish()
            me.semaphore.signal()
        })
}
