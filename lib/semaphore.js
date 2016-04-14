module.exports = function createSemaphore (_capacity) {
    var capacity = _capacity || 1
    var current  = 0
    var queue    = []

    var semaphore = {
        wait: wait
      , signal: signal
    }

    return semaphore

    function wait (f) {
        if (current < capacity) f()
        else queue.push(f)
        current += 1
    }

    function signal () {
        if (current >= 0) {
            ;(typeof queue[0] === 'function') && queue.shift()()
            current -= 1
        }
    }
}
