'use strict'
var test   = require('tape')
var xtend  = require('xtend')
var action = require('../action')

test('var action = new Action(label, _opt, _role', t => {
    t.ok((new action('Foo')).publish, 'var action = new Action(...)')
    t.ok(action('Foo', null, {put: () => {}}).put, 'var action = Action(...)')
    t.end()
})

test('action._publish(data)', t => {
    var a = action('Tap', {source: 0}, {
        tap: function () {
            this._publish(++this.opt.source)
        }
    })

    var c = 0

    a.once((payload) => {
        t.deepEqual(payload, {label: 'Tap', value: 1}, 'payload deepEq {label: "Tap", value: 1}')
        c += 1
        a.once((payload) => {
            t.deepEqual(payload, {label: 'Tap', value: 2}, 'payload deepEq {label: "Tap", value: 2}')
            c += 1
            a.subscribe((payload) => {
                t.deepEqual(payload, {label: 'Tap', value: 3}, 'payload deepEq {label: "Tap", value: 3}')
                c += 1

                setTimeout(() => {
                    t.is(c, 3, 'a.publish 3 times')
                    t.end()
                }, 10)
            })
        })
    })

    a.tap()
    a.tap()
    a.tap()
})

test('action.error(err) # 例外とpayloadはそれぞれ別系統で発行し、別系統で回収する', t => {
    var a = action('Tap', {source: [9, 8]}, {
        tap: function () {
            var value = this.opt.source.shift()
            if (value === null || typeof value === 'undefined')
                this.error(new Error('eof'))
            else
                this._publish(value)
        }
    })

    var c = 0
    var e = 0
    a.once((payload) => {
        t.deepEqual(payload, {label: 'Tap', value: 9}, 'payload deepEqual {label: "Tap", value: 9}')
        c += 1
        a.subscribe((payload) => {
            t.deepEqual(payload, {label: 'Tap', value: 8}, 'payload deepEqual {label: "Tap", value: 8}')
            c += 1
        })
    })

    a.addHandleError(err => {
        t.is(err.message, 'eof', 'err.message === "eof" # 1st')
        e += 1
        a.handleError = null
        a.addHandleError(err => {
            t.is(err.message, 'eof', 'err.message === "eof" # 2nd')
            e += 1
        })
    })

    setTimeout(() => {
        t.is(c, 2, 'a.publish 2 times')
        t.is(e, 2, 'a.error   2 times')
        t.end()
    }, 0)

    a.tap()
    a.tap()
    a.tap()
    a.tap()
})
