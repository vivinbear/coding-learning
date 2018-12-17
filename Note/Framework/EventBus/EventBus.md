## 前沿

> React/Vue不同组件之间是怎么通信的?

#### Vue

1. 父子组件用`props`进行数据通信
2. 兄弟组件用`Event Bus`进行通信
3. 当项目足够大,足够复杂时,需要`Vuex`进行全局的状态管理/通信
4. `$dispatch`(废除)和`$broadcast`(废除)

#### React

1. 父子组件,父->子 直接用`props` 子->父 用`callback`回调
2. 兄弟组件,用发布订阅的Event模块
3. 项目足够大时,用`Redux`,`Mobx`全局状态管理
4. 用新的`Context Api`

说一下如何实现`Event Bus`

#### 1. 基本构造

1.1 初始化class

```js

class EventEmitter{
    constructor(){
        // 用Map来存储事件/回调,比用Object的好处是,键可以是任意类型的数据且不会重复
        this._events = this._events || new Map()
        // 设置最大监听数
        this._maxlisteners = this._maxListeners || 10
    }
}

```

1.2 监听与触发

触发监听函数我们可以用`apply`和`call`两种方法,在参数少时`call`的性能更好,参数多时`apply`的性能更好.

当node全面拥抱ES6之后,相应的`call`和`apply`操作,用`Reflext`新关键字重写了

```js

// 触发类别为type的事件
EventEmitter.prototype.emit = function(type,...args){
    let handler;
    // 从存储事件的map(this._event)中获取对应事件的回调函数
    handler = this._events.get(type);
    if(args.length > 0){
        handler.apply(this,args)
    }else{
        handler.call(this)
    }
    return true
}

// 监听名为type的事件
EventEmitter.prototype.addListener = function(type,fn){
    // 将type事件以及对应的回调函数fn存入this._evnet中
    if(!this._evnets.get(type)){
        this._events.set(type,fn)
    }
}

```

#### 2. 升级改造

2.1 监听/触发器升级

