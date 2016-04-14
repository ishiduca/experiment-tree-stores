'use strict'
var React     = require('react')
var ReactDOM  = require('react-dom')
var action    = require('experiment-tree-stores/action')
var store     = require('experiment-tree-stores/store')
var composite = require('experiment-tree-stores/store-composite')
var rt        = require('experiment-tree-stores')

var TAP = 'Tap'

var actTap   = action(TAP, null, require('./actions/tap'))
var storeSum = store({sum: 0}, null, null, require('./stores/sum'))
var storeCnt = store({count: 0}, null, null, require('./stores/count'))
var storeAve = store(null, [storeSum, storeCnt], null, require('./stores/average'))
var compTap  = composite(TAP, null, [storeAve], null, require('./stores/tap'))

var root = rt(actTap)(compTap)

var App = require('./components/app')

ReactDOM.render(<App context={{
    root: root
  , actTap: actTap
}} />, document.querySelector('#react-app'))
