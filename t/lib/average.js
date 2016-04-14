var xtend = require('xtend')
module.exports = {
    work: (newState, state, done) => {
        done(null, xtend(newState, {average: newState.sum / newState.count}))
    }
}
