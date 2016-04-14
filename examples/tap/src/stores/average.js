var xtend = require('xtend')

module.exports = {
    work: function (ns, state, done) {
        done(null, xtend(state, ns, {average: ns.sum / ns.count}))
    }
}
