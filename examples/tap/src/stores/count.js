module.exports = {
    work: function (n, state, done) {
        setTimeout(() => {
            done(null, {count: state.count + 1})
        , 0})
    }
}
