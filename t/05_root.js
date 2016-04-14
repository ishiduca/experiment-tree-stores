'use strict'
var test      = require('tape')
var xtend     = require('xtend')
var rt        = require('../root')
var store     = require('../store')
var composite = require('../store-composite')

test('root', t => {
    var sum = store({sum: 0}, null, null, {work: (d, s, done) => {
        setTimeout(() => {
            if (typeof d !== 'number') done(new TypeError('NOT NUMBER sum'))
            else done(null, {sum: s.sum + d})
        }, 0)
    }})

    var count = store({count: 0}, null, null, {work: (d, s, done) => {
        if (typeof d !== 'number') done(new TypeError('NOT NUMBER count'))
        else done(null, {count: s.count + 1})
    }})

    var ave = store(null, [sum, count], null, {work: (ns, s, done) => {
        done(null, xtend(ns, {average: ns.sum / ns.count}))
    }})

    var tap = composite('Tap', null,[ave],null, {work: (ns, s, done) => {
        done(null, ns)
    }})

    var root = rt(tap)
    var c    = 0
    var e    = 0

    root.subscribe(() => {
        t.deepEqual(root.getState(), {count: 1, sum: 2, average: 2}
          , 'root.getState() deepEq {count:1, sum:2, average:2}')
        c += 1
    })

    root.addHandleError((err) => {
        t.is(err.message, 'NOT NUMBER count'
          , 'err.message === "NOT NUMBER count"')
        e += 1
        root.handleError = null
        root.addHandleError((err) => {
            t.is(err.message, 'NOT NUMBER sum'
              , 'err.message === "NOT NUMBER sum"')
            e += 1
        })
    })

    rootHandleStoresError(root.children, root)

    root.post({label: 'notTap', value: 1}, 1)
    root.post({label: 'Tap', value: 2}, 1)
    root.post({label: 'Tap', value: 'hoge'}, 1)

    setTimeout(() => {
        t.is(c, 1, 'root.publish 1 time')
        t.is(e, 2, 'root.error   2 times')
        t.end()
    }, 100)
})

function rootHandleStoresError (stores, root) {
    for (var i = 0, len = (stores || []).length; i < len; i++) {
        stores[i].addHandleError(function (err) {
            root.error(err)
        })
        rootHandleStoresError(stores[i].children, root)
    }
}
