'use strict'
var test      = require('tape')
var action    = require('../action')
var store     = require('../store')
var composite = require('../store-composite')
var creator   = require('../index')

test('var root = require(app)(actions)(composites)', t => {
    var LABEL = 'Tap'

    var sum   = store({sum: 0},   null, null, require('./lib/sum'))
    var count = store({count: 0}, null, null, require('./lib/count'))
    var ave   = store(null, [sum, count], null, require('./lib/average'))
    var compTap = composite(LABEL, {}, [ave], null, {work: (ns, s, d) =>{
        d(null, ns)
    }})

    var actTap = action(LABEL, {source: [1, 'hoge', 3]}, {
        tap: function () {
            var num = this.opt.source.shift()
            if (typeof num === 'undefined' || num === null)
                this.error(new Error('eos'))
            else
                this._publish(num) 
        }
    })

    var root = creator(actTap)(compTap)

    var errs = []
    var spy  = []

    root.addHandleError(err => {
        errs.push(err)
    })
    root.subscribe(() => {
        spy.push(root.getState())
    })

    actTap.tap() // 1
    actTap.tap() // store error
    actTap.tap() // 3
    actTap.tap() // action error

    setTimeout(() => {
        t.is(errs.length, 3, 'errs count 3')
        t.is(errs[0].message, 'eos', 'errs[0].message === "eos"')
        t.is(errs[1].message, '"data" must be "Number"'
          , 'errs[1].message === \'"data" must be "Number"\'')
        t.is(errs[2].message, '"data" must be "Number"'
          , 'errs[2].message === \'"data" must be "Number"\'')
        t.is(spy.length, 2, 'spy count 2')
        t.deepEqual(spy[0], {sum: 1, count: 1, average: 1}
          , 'spy[0] deepEq {sum:1, count:1, average:1}')
        t.deepEqual(spy[1], {sum: 4, count: 2, average: 2}
          , 'spy[1] deepEq {sum:4, count:2, average:2}')
        t.end()
    }, 500)
})
