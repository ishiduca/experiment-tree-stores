module.exports = {
    work: (data, state, done) => {
        setTimeout(() => {
            if (typeof data !== 'number')
                done(new TypeError('"data" must be "Number"'))
            else
                done(null, {count: state.count + 1})
        }, 10)
    }
}
