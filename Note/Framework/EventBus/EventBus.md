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
    // 当有参数时,用apply,无参数时,用call 性能更佳
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

目前我们的`addListener`目前实现了监听功能,但是只能绑定一个监听者,因此我们需要改进一下,可以让多个监听者同时监听.

```js

EventEmitter.prototype.emit = function(type,...args){
    let handler;
    // 获取存储的监听
    handler = this._event.get(type)
    // 如果是数组,则表明有多个监听者,则遍历数组,触发每一个回调函数
    if(Array.isArray(handler)){
        for(let i = 0;i<handler.length;i++){
            if(args.length >0){
                handler[i].apply(this,args);
            }else{
                handler[i].call(this);
            }
        }
    }else{
        // 非数组,则表明只有一个监听者,直接触发其回调即可
        if(args.length > 0){
            handler.apply(this,args);
        }else{
            handler.call(this)
        }
    }
    return true
}

EventEmitter.prototype.addListener = function(type,fn){
    // 获得存储的监听
    let handler = this._event.get(type)
    // 如果没有监听,则设置监听
    if(!handler){
        this._event.set(type,fn);
    }else if(handler && typeof handler === 'function'){
        // 如果已有监听,且只有一个,则将监听改为数组
        this._events.set(type,[handler,fn]);
    }else{
        // 如果已有监听,且大于两个,则往监听数组内push新的监听回调
        handler.push(fn);
    }
}

```

至此,已经完成了多个监听了

```js

let emitter = new EventEmitter()

emitter.addListener('listen',data=>{
    console.log(`listen one ${data}`)
})

emitter.addListener('listen',data=>{
    console.log(`listen two ${data}`)
})

emitter.addListener('listen',data=>{
    console.log(`listen three ${data}`)
})

emitter.emit('listen','success')
// listen one success
// listen two success
// listen three success

```

2.2 移除监听

在可以添加多个监听之后,我们尝试增加移除监听的`removeListener`函数来移除监听.

```js

EventEmitter.prototype.removeListener = function(type,fn){
    // 获取事件对应的监听函数清单
    let handler = this._events.get(type)
    // 如果是函数,说明被监听了一次,那么直接移除就可以了
    if(handler && typeof handler === 'function'){
        this._events.delete(type);
    }else{
        // 如果不是,则说明监听了多次
        let position;
        for(let i = 0;i<handler.length;i++){
            // 如果监听函数一致,则赋值其下标,用于移除
            if(handler[i]===fn){
                position = i;
            }else{
                position = -1;
            }
        }
        // position不为-1 则移除
        if(position !== -1){
            handler.splice(position,1);
            // 如果清除后,只剩一个函数,那么取消数组,以函数形式保存
            if(handler.length === 1){
                this._events.set(type,handler[0])
            }
        }else{
            return this
        }
    }
}

```

#### 目前的问题

1. 匿名函数无法移除监听
2. 没有`removeAlllisteners`等方法
3. 没有对传入的参数进行校验