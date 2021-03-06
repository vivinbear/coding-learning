function observe(obj) {
    if (!obj || typeof obj !== 'object') return
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}

function defineReactive(obj, key, value) {
    observe(value)
    let dp = new Dep()
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            console.log('get value')
            if (Dep.target) {
                dp.addSub(Dep.target)
            }
            return value
        },
        set(newValue) {
            console.log('set value')
            value = newValue
            dp.notify()
        }
    })
}

class Dep {
    constructor() {
        this.subs = []
    }
    addSub(sub) {
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
    // document.querySelector('div').innerText = value
    console.log(value)
}

class Watcher {
    constructor(obj, key, cb) {
        Dep.target = this
        this.cb = cb
        this.obj = obj
        this.key = key
        this.value = obj[key]
        Dep.target = null
    }
    update() {
        this.value = this.obj[this.key]
        this.cb(this.value)
    }
}

let data = { name: 'zhengwei' }
observe(data)
new Watcher(data, 'name', update)
let name = data.name
data.name = 'wufan'