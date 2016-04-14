'use strict'
var test = require('tape')
var semaphroe = require('../lib/semaphore')

test('var sem = semaphroe(capacity)', (t) => {
    var sem = semaphroe(3)
    var spy = []
    var datas = [1, 2, 3, 4, 5]

    datas.forEach(num => {
        sem.wait(() => {
            spy.push(num)
        })
    })

    console.log('# var sem = semaphroe(3)')
    t.deepEqual(spy, [1, 2, 3], 'spy deepEqual [1,2,3]')

    console.log('# sem.signal()')
    sem.signal()

    t.deepEqual(spy, [1,2,3,4], 'spy deepEqual [1,2,3,4]')

    console.log('# sem.signal()')
    sem.signal()

    t.deepEqual(spy, [1,2,3,4,5], 'spy deepEqual [1,2,3,4,5]')

    console.log('# sem.signal()')
    t.doesNotThrow(() => {sem.signal()}, null, 'sem.signal() does not throw error')
    t.deepEqual(spy, [1,2,3,4,5], 'spy deepEqual [1,2,3,4,5]')

    t.end()
})
