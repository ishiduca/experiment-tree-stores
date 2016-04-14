module.exports = {
    work: (data, state, done) => {
        if (typeof data !== 'number')
            done(new TypeError('"data" must be "Number"'))
        else
            done(null, {sum: state.sum + data})
    }
}
