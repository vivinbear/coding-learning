## MVVM

### 什么是MVVM

* Model : 数据模型
* View : 界面
* ViewModel : 连通`Model`和`View`

在`MVVM`中,核心就是数据的`双向绑定`,例如`Angular`的`脏数据检测`,`Vue`中的`数据劫持
`

### 脏数据检测

### 数据劫持 Object.defineProperty()

`Vue`核心使用了`Object.defineProperty()`来实现双向绑定,通过这个函数可以检测到`属性`的`get(读取)`和`set(赋值)`

```js

function observe(obj) {
    // 判断是不是object,如果不是直接返回
    if (!obj || typeof obj !== 'object') return
    // 是object的话,将对象上的所有属性都加入监听
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}

function defineReactive(obj, key, value) {
    // 递归监听属性值
    observe(value)
    // 通过Object.defineProperty监听属性的读和写
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            // 当获取对象的属性值时,会触发这个方法,所以可以在这里进行属性值获取的监听
            console.log('get value')
            return value
        },
        set(newValue) {
            // 当给对象的属性赋值时,会触发这个方法,所以可以在这里进行属性赋值的监听
            console.log('set value')
            value = newValue
        }
    })
}

let data = { name: 'zhengwei' }
observe(data)
let name = data.name
// get value
data.name = 'wufan'
// set value

```

以上基本实现了数据的双向绑定,可以在取值和赋值的时候检测到对应的事件,接下来就要给属性增加发布订阅

```js

function observe(obj) {
    if (!obj || typeof obj !== 'object') return
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}

function defineReactive(obj, key, value) {
    observe(value)
    let dp = new Dep()
    // 建立一个订阅者,用来订阅和发布当前属性的所有watcher
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            console.log('get value')
            // 如果有watcher,则push到订阅者的数组中
            if (Dep.target) {
                dp.addSub(Dep.target)
            }
            return value
        },
        set(newValue) {
            console.log('set value')
            value = newValue
            // 当有值改变时,通知所有订阅者,更新UI
            dp.notify()
        }
    })
}

class Dep {
    constructor() {
        this.subs = []
    }
    addSub(sub) {
        // sub就是Watcher实例
        this.subs.push(sub)
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}

Dep.target = null

function update(value) {
    // 更新Dom
    document.querySelector('div').innerText = value
    console.log(value)
}

class Watcher {
    constructor(obj, key, cb) {
        // 将Dep.target指向自己
        // 然后触发属性的getter添加监听
        // 最后将Dep.target置空
        Dep.target = this
        this.cb = cb
        this.obj = obj
        this.key = key
        // 在此赋值时,触发属性的getter,同时此时Dep.target为自身,所以触发监听
        this.value = obj[key]
        Dep.target = null
    }
    update() {
        // 获取最新的值
        this.value = this.obj[this.key]
        // 调用update方法更新dom
        this.cb(this.value)
    }
}

let data = { name: 'zhengwei' }
observe(data)
// 模拟解析`{{name}}`的操作
new Watcher(data, 'name', update)
// 触发Dom更新
data.name = 'wufan'

```

`Object.defineProperty`方法存在一些缺点

1. 只能监听属性,所以需要对整个对象的所有属性进行循环监听
2. 没有办法原生监听`数组`

而`Proxy`除了具有`Object.defineProperty`的优势,还没有以上两个缺点

### Proxy

`Proxy`在ES2015中被正式发布,可以在目标对象上架设一层'拦截',所以属于`元编程`

#### Proxy可以直接监听对象而非属性

```js

const input = document.getElementById('input');
const p = document.getElementById('p');
const obj = {};

const newObj = new Proxy(obj,{
    get(target,key,receiver){
        console.log(`getting ${key}`)
        return Reflect.get(target,key,receiver)
    },
    set(target,key,value,receiver){
        console.log('setting')
        if(key === 'text'){
            input.value = value;
            p.innerHTML = value;
        }
        return Reflect.set(target,key,value,receiver)
    }
})

input.addEventListener('keyup',e=>{
    newObj.text = e.target.value
})

```

#### Proxy可以直接监听数组的变化

```js

const list = document.getElementById('list');
const btn = document.getElementById('btn');

// 渲染列表
const Render = {
  // 初始化
  init(arr) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < arr.length; i++) {
      const li = document.createElement('li');
      li.textContent = arr[i];
      fragment.appendChild(li);
    }
    list.appendChild(fragment);
  },
  // 我们只考虑了增加的情况,仅作为示例
  change(val) {
    const li = document.createElement('li');
    li.textContent = val;
    list.appendChild(li);
  },
};

// 初始数组
const arr = [1, 2, 3, 4];

// 监听数组
const newArr = new Proxy(arr, {
  get(target, key, receiver) {
    console.log(key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log(target, key, value, receiver);
    if (key !== 'length') {
      Render.change(value);
    }
    return Reflect.set(target, key, value, receiver);
  },
});

// 初始化
window.onload = function() {
    Render.init(arr);
}

// push数字
btn.addEventListener('click', function() {
  newArr.push(6);
});

```

#### proxy的其他优势

1. Proxy有13中拦截方法,不限于apply、ownKeys、has等
2. Proxy返回的是一个新对象

## VirtualDOM

直接操作`DOM`是很消耗性能的一件事情,所以我们可以通过JS来模拟`DOM`对象,毕竟操作JS对象比操作`DOM`省时的多

### JS模拟`DOM`对象

```js

class Element {
    constructor(tag, props, children, key) {
        /**
        * @param {String} tag 'div' 标签名
        * @param {Object} props { class: 'item' } 属性值
        * @param {Array} children [ Element1, 'text'] 包含的DOM或者文本内容
        * @param {String} key option 唯一的key
        */
        this.tag = tag
        this.props = props
        // 判断子节点,如果子节点是数组,则将子节点赋值给children属性,如果是字符串,则赋值给key
        if (Array.isArray(children)) {
            this.children = children
        } else if (isString(children)) {
            this.key = children
            this.children = null
        }
        if (key) this.key = key
    }
    render() {
        let root = this._createElement(this.tag, this.props, this.children, this.key)
        document.body.appendChild(root)
        return root
    }
    create() {
        return this._createElement(this.tag, this.props, this.children, this.key)
    }
    _createElement(tag, props, child, key) {
        // 先创建对应的DOM节点
        let el = document.createElement(tag)
        // 循环处理props,给节点设置属性
        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                const value = props[key]
                el.setAttribute(key, value)
            }
        }
        if (key) {
            el.setAttribute('key', key)
        }
        // 渲染子节点
        if (child) {
            child.forEach(element => {
                if (element instanceof Element) {
                    child = this._createElement(element.tag, element.props, element.children, element.key)
                } else {
                    child = document.createTextNode(element)
                }
                // 将子节点添加到创建的DOM节点中
                el.appendChild(child)
            })
        }
        return el
    }
}

```