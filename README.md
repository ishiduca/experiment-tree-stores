# experiment-of-tree-store

Reactに寄せた ~~Flux/~~Store の実験のための実装

## motivation

* 本当にstateが更新された場合のみ, "change" Event を発行する方がComponent側には親切なのでは?
* "change" Event のみの発行で良いのなら, クラシカルなObservableの実装で良いはず


## feature

* 木構造のストア群（Root -- Composite -- Leaf)
* Storeは一つstateを持つ
* ActionCreator が発行したデータを RootStore が受け取り, 子ストア(CompositeStore)に渡す
* CompositeStoreは子ストア(LeafStore)にデータを渡す
* 末端のストアは受け取ったデータをゴニョゴニョして, 自身のstateを更新し, 親ストアにstateを発行する
* 子ストアからstateを受け取ったストアはそのstateと自身が管理するstateをゴニョゴニョして親ストアに発行する
* 複数の子ストアを持つストアは, 子ストア全てからstateが渡されるまで自身のstateの更新を待つ
* RootStoreは子ストア(CompositeStore)から受け取ったstateの結果が前回受け取ったstateと差異がない場合, stateを更新して, publishする


## example

click counter

```
cd examples/tap
npm install
npm run build
open ./publish/index.html
```

todo

```
cd example/todo
npm install
npm run build
npm start
open http://0.0.0.0:5000
```

### Store API

publish

subscribe

unsubscribe

once

post

work

addHandleError

error

### authour

ishiduca@gmail.com

#license

MIT
