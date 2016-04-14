module.exports = {
    updateText: function (text) {
        this._publish({text: text})
    }
  , clearText: function () {
        this._publish({text: ''})
    }
  , prepare: function (_todo) {
        this._publish(_todo.copy())
    }
}
