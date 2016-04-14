var store = require('./store')

module.exports = function (_stores) {
    var stores = Array.isArray(_stores)
        ? _stores : [].slice.apply(arguments)

    return store({}, stores, null, {
        work: function (states, rootState, done) {
            done(null, states)
        }
    })
}
