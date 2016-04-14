'use strict'
var test     = require('tape')
var xtend    = require('xtend')
var store    = require('../store')
var composite = require('../store-composite')
var Observer  = require('../lib/observer')

test('var store = new StoreComposite(label, initState, children, _opt, _role)', t => {
    t.ok((new composite('Test', {foo: 1})).publish,   'var composite = new StoreComposite(...)')
    t.ok(composite(     'Test', {bar: true}).publish, 'var store = StoreComposite(...)')
    t.end()
})

test('store.post(payload)', t => {
    var count = store({count: 0}, null, null, {work: (d, s, done) => {
        setTimeout(() => {
            done(null, {count: s.count + 1})
        }, 10)
    }})
    var tap = composite('Tap', null, [count], null, {work: (s, _, done) => {
        done(null, s)
    }})

    var c = 0

    tap.once(() => {
        t.deepEqual(tap.getState(), null, 'tap.getState() === null # label異なるので現在の state === null をpublishする')
        c += 1
        tap.once(() => {
            t.deepEqual(tap.getState(), {count: 1}, 'tap.getState() === {count: 1} # labelが同じので childrenの結果を反映した新しいstateをpublishする')
            c += 1
            tap.once(() => {
                t.deepEqual(tap.getState(), {count: 1}, 'tap.getState() === {count: 1} # label異なるので 現在のstateをpublishする')
                c += 1
                tap.subscribe(() => {
                    t.deepEqual(tap.getState(), {count: 2}, 'tap.getState() === {count: 2} # labelが同じなので childrenの結果を反映した新しいstateをpublishする')
                    c += 1

                    setTimeout(() => {
                        t.is(c, 4, 'tap.post 4 times')
                        t.end()
                    }, 100)
                })
            })
        })
    })

    var root = new Observer

    root.subscribe((payload) => {
        tap.post(payload)
    })

    root.publish({
        label: 'notTap', value: 1
    })
    root.publish({
        label: 'Tap', value: 2
     })
     root.publish({
        label: 'tap', value: 3
     })
    root.publish({
        label: 'Tap', value: 4
     })
})
