module.exports = {
    work: function (ns, _, done) {
        ns.todos = ns.todos.filter(function (todo) {
            return !! todo.match(ns.filter)
        }).sort(function (_a, _b) {
            var a = _a[ns.sort[0]]
            var b = _b[ns.sort[0]]
            return ((a > b) ? 1 : (b > a) ? -1 : 0) * ns.sort[1]
        }).map(function (todo) {
            return todo.addTimeAgo(todo)
        })

        done(null, ns)
    }
}
