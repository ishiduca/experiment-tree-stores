'use strict'
var test     = require('tape')
var Observer = require('../lib/observer')

test('var o = new Observer', (t) => {
    var spy = []
    var once = []
    var o   = new Observer
    o.subscribe(function (a, b, c) {
        spy.push([a, b, c])
        if (spy.length === 2) onEnd()
    })
    o.once(function (a, b, c) {
        once.push([a, b, c])
    })
    o.publish(1, 2, 3)
    o.publish(10, 9, 8)

    function onEnd () {
        t.is(spy.length, 2, 'o.subscribe called 2 times')
        t.deepEqual(spy[0], [1, 2, 3],  'spy[0] deepEqual [1, 2, 3]')
        t.deepEqual(spy[1], [10, 9, 8], 'spy[1] deepEqual [10, 9, 8]')
        t.is(once.length, 1, 'o.once called 1 time')
        t.deepEqual(once[0], [1, 2, 3],  'once[0] deepEqual [1, 2, 3]')
        t.end()
    }
})

test('o.unsubscribe(sub)', (t) => {
    var spy = []
    var o   = new Observer

    var sub = function (n) {spy.push(n)}

    o.subscribe(sub)

    o.publish(1)
    o.publish(2)

    o.unsubscribe(sub)

    o.publish(3)
    o.publish(4)

    o.subscribe(sub)

    o.publish(5)

    t.is(spy.length, 3, 'spy.length === 3')
    t.is(spy[0], 1, 'spy[0] === 1')
    t.is(spy[1], 2, 'spy[0] === 2')
    t.is(spy[2], 5, 'spy[2] === 5')
    t.end()
})
