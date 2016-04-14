'use strict'
var test  = require('tape')
var xtend = require('xtend')
var store = require('../store')

test('var store = new Store(initState, children, _opt, _role)', t => {
    t.ok((new store({foo: 1})).publish, 'var store = new Store(...)')
    t.ok(store({bar: true}).publish, 'var store = Store(...)')
    t.end()
})

test('var isUpdated = store.setState(newState)', t => {
    var s = store({foo: {bar: [1, 2, 3]}})
    t.is(s.setState(), false, 's.setState() === false')
    t.is(s.setState(null), false, 's.setState(null) === false')
    t.is(s.setState({}), false, 's.setState({}) === false')
    t.is(s.setState({foo: {bar: [1,2,3]}}), false
      , 's.setState({foo: {bar: [1,2,3]}}) === false')
    t.is(s.setState({foo: null}), true, 's.setState({foo: null}) === true')
    t.deepEqual(s.getState(), {foo: null}
      , 's.getState() deepEq {foo: null}')
    t.is(s.setState({bar: [1,2,3]}), true
      , 's.setState({bar: [1,2,3]}) === true')
    t.deepEqual(s.getState(), {foo: null, bar: [1,2,3]}
      , 's.getState() deepEq {foo: null, bar: [1,2,3]}')
    t.end()
})

test('store.post(data, _doPublishFlg)', t => {
    var s = store({foo: 0}, null, null, {
        work: (data, state, done) => {
            done(null, {foo: state.foo + data})
        }
    })

    var spy = []

    s.subscribe(function () {
        spy.push(s.getState())
    })

    t.test('no use _doPublishFlg'
         + ' # store.state が変化していなくても publishする', (tt) => {
        s.post(0)
        s.post(1)
        s.post(0)
        s.post(0)

        tt.deepEqual(spy, [{foo: 0}, {foo: 1}, {foo: 1}, {foo: 1}]
          , 'spy deepEq [ {foo: 0}, {foo: 1}, {foo: 1}, {foo: 1} ]')
        tt.end()
    })

    t.test('use _doPublishFlg'
         + ' # store.state が変化していない場合 publishしない', (tt) => {
        spy = []
        s.setState({foo: 0})

        s.post(0, !0) // 更新されていないので publish しない
        s.post(1, !0) // 更新されているので publish する
        s.post(0, !0) // 更新されていないので publish しない
        s.post(0)     // 更新されていないが、_doPublishFlg が
                      // 指定されていないので publish する
        s.post(2, !0) // 更新されているので publish する

        tt.deepEqual(spy, [{foo: 1}, {foo: 1}, {foo: 3}]
          , 'spy deepEq [ {foo: 1}, {foo: 1}, {foo: 3} ]')
        tt.end()
    })

    t.end()
})

test('store.post(data) -> 例外発行した際の挙動', t => {
    var sum  = store({sum: 0}, null, null, require('./lib/sum'))
    var spy  = []
    var errs = []

    sum.subscribe(() => {
        spy.push(sum.getState())
    })
    sum.addHandleError((err) => {
        errs.push(err)
    })

    sum.post()
    sum.post(1)
    sum.post('2')
    sum.post(2)

    t.deepEqual(errs.map(m)
      , ['"data" must be "Number"','"data" must be "Number"']
      , 'errs deepEa [\'"data" must be "Number"\',\'"data" must be "Number"\']')
    t.deepEqual(spy, [{sum: 0}, {sum: 1}, {sum: 1}, {sum: 3}]
      , 'spy deepEq [{sum: 0}, {sum: 1}, {sum: 1}, {sum: 3}]')
    t.end()

    function m (err) { return err.message }
})

test('store.post(data) -> 例外発行した際の挙動 # 非同期処理の場合', t => {
    var count  = store({count: 0}, null, null, require('./lib/count'))
    var spy  = []
    var errs = []

    count.subscribe(() => {
        spy.push(count.getState())
        spy.length === 4 && onEnd()
    })
    count.addHandleError((err) => {
        errs.push(err)
    })

    count.post()
    count.post(1)
    count.post('2')
    count.post(2)

    function onEnd () {
        t.deepEqual(errs.map(m)
          , ['"data" must be "Number"','"data" must be "Number"']
          , 'errs deepEa [\'"data" must be "Number"\',\'"data" must be "Number"\']')
        t.deepEqual(spy, [{count: 0}, {count: 1}, {count: 1}, {count: 2}]
          , 'spy deepEq [{count: 0}, {count: 1}, {count: 1}, {count: 2}]')
        t.end()
    }

    function m (err) { return err.message }
})

test(['store.post(data)'
  , '複数のchildrenを持つ'
  , '全てのストアは同期処理'
].join('\n# '), t => {
    var sum   = store({sum: 0}, null, null, require('./lib/sum'))
    var count = store({count: 0}, null, null, {work: (d, state, done) => {
        done(null, {count: state.count + 1})
    }})
    var average = store(null, [sum, count], null, require('./lib/average'))
    var spy     = []

    average.subscribe(() => {
        spy.push(average.getState())
    })

    average.post(1)
    average.post(3)

    t.deepEqual(spy
      , [{sum: 1, count: 1, average: 1},{sum: 4, count: 2, average: 2}]
      , 'spy deepEq [{sum:1, count:1, average:1},{sum:4, count:2, average:2}]')
    t.end()
})

test(['store.post(data)'
  , '複数のchildrenを持つ'
  , '全てのストアは非同期処理'
].join('\n# '), t => {
    var sum   = store({sum: 0}, null, null, {work: (data, state, done) => {
        setTimeout(() => {
            done(null, {sum: state.sum + data})
        }, 10)
    }})
    var count = store({count: 0}, null, null, {work: (d, state, done) => {
        setTimeout(() => {
            done(null, {count: state.count + 1})
        }, 0)
    }})
    var average = store(null, [sum, count], null, {work: (state, s, done) => {
        setTimeout(() => {
            done(null, xtend(state, {average: state.sum / state.count}))
        }, 200)
    }})

    var c = 0
    average.once(() => {
        t.deepEqual(average.getState(), {average: 1, count: 1, sum: 1}
          , 'average.getState() deepEq {average:1, count:1, sum:1}')
        c += 1
        average.subscribe(() => {
            t.deepEqual(average.getState(), {average: 2, count: 2, sum: 4}
              , 'average.getState() deepEq {average:2, count:2, sum:3}')
            c += 1
            setTimeout(() => {
                t.is(c, 2, 'average.publish 2 times')
                t.end()
            }, 1000)
        })
    })

    average.post(1)
    average.post(3)
})

test(['store.post(data)'
  , '複数のchildrenを持つ'
  , 'ストアは同期・非同期処理が混在'
].join('\n# '), t => {
    var sum   = store({sum: 0}, null, null, {work: (data, state, done) => {
        setTimeout(() => {
            done(null, {sum: state.sum + data})
        }, 10)
    }})
    var count = store({count: 0}, null, null, {work: (d, state, done) => {
            done(null, {count: state.count + 1})
    }})
    var average = store(null, [sum, count], null, {work: (state, s, done) => {
        setTimeout(() => {
            done(null, xtend(state, {average: state.sum / state.count}))
        }, 200)
    }})

    var c = 0
    average.once(() => {
        t.deepEqual(average.getState(), {average: 1, count: 1, sum: 1}
          , 'average.getState() deepEq {average:1, count:1, sum:1}')
        c += 1
        average.subscribe(() => {
            t.deepEqual(average.getState(), {average: 2, count: 2, sum: 4}
              , 'average.getState() deepEq {average:2, count:2, sum:3}')
            c += 1
            setTimeout(() => {
                t.is(c, 2, 'average.publish 2 times')
                t.end()
            }, 1000)
        })
    })

    average.post(1)
    average.post(3)
})
