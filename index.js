var rt = require('./root')

module.exports = function setupApp () {
    var actions = [].slice.apply(arguments)

    return function setupRoot () {
        var storeComposites = [].slice.apply(arguments)
        var root = rt(storeComposites)

        for (var i = 0; i < actions.length; i++) {
            actions[i].subscribe(actionPassRoot)
            actions[i].addHandleError(rootHandleError)
        }

        rootHandleStoresError(root.children)

        return root

        function actionPassRoot (payload) {
            root.post(payload, true)
        }

        function rootHandleError (err) {
            root.error(err)
        }

        function rootHandleStoresError (stores) {
            for (var i = 0, len = (stores || []).length; i < len; i++) {
                stores[i].addHandleError(rootHandleError)
                rootHandleStoresError(stores[i].children)
            }
        }
    }
}
