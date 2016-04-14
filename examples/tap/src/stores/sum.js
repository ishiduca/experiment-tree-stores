module.exports = {
    work: function (n, state, done) {
        done(null, {sum: state.sum + n})
    }
}
