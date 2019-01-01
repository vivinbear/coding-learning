## 前端路由

### 种类

* 基于hash的路由
* 基于history的路由

### 基于hash的路由实现

hash路由有一个很明显的标志就是带有`#`,我们主要通过监听`#`之后的变化来进行路由跳转

1.1 初始化class

```js

class Routers {
    constructor(){
        // 用于存储路由
        this.routes = {};
        // 当前路由的URL
        this.currentUrl="";
    }
}

```

1.2 实现路由hash存储与执行

在初始化工作完成后,我们需要处理两个问题:

* 将路由的hash以及对应的callback回调函数存储
* 触发路由hash变化后,执行对应的callback函数

所以我们继续扩展我们的class

```js

class Routers {
    constructor(){
        this.routes = {};
        this.currentUrl = "";
    }
    route(path,callback{
        this.routes[path] = callback || function(){};
    }
    refresh(){
        this.currentUrl = location.hash.slice(1) || '/';
        this.route[this.currentUrl]();
    }
}

```

1.3 监听对应的事件

```js

class Routers {
    constructor(){
        this.routes = {};
        this.currentUrl = "";
        this.refresh = this.refresh.bind(this);
        window.addEventListener('load', this.refresh, false);
    window.addEventListener('hashchange', this.refresh, false);
    }
    route(path,callback{
        this.routes[path] = callback || function(){};
    }
    refresh(){
        this.currentUrl = location.hash.slice(1) || '/';
        this.route[this.currentUrl]();
    }
}

```

### 增加回退功能

上面已经实现了基本的`路由切换`功能,但并没有我们常用的`回退`和`前进`功能,所以我们继续进行升级改造.

2.1 实现后退功能

我们创建一个数组来储存历史的`hash路由`,并且创建一个`指针`来指向不同的`hash路由`

```js

class Routers {
  constructor() {
    // 储存hash与callback键值对
    this.routes = {};
    // 当前hash
    this.currentUrl = '';
    // 记录出现过的hash
    this.history = [];
    // 作为指针,默认指向this.history的末尾,根据后退前进指向history中不同的hash
    this.currentIndex = this.history.length - 1;
    this.refresh = this.refresh.bind(this);
    this.backOff = this.backOff.bind(this);
    window.addEventListener('load', this.refresh, false);
    window.addEventListener('hashchange', this.refresh, false);
  }

  route(path, callback) {
    this.routes[path] = callback || function() {};
  }

  refresh() {
    this.currentUrl = location.hash.slice(1) || '/';
    // 将当前hash路由推入数组储存
    this.history.push(this.currentUrl);
    // 指针向前移动
    this.currentIndex++;
    this.routes[this.currentUrl]();
  }
  // 后退功能
  backOff() {
    // 如果指针小于0的话就不存在对应hash路由了,因此锁定指针为0即可
    this.currentIndex <= 0
      ? (this.currentIndex = 0)
      : (this.currentIndex = this.currentIndex - 1);
    // 随着后退,location.hash也应该随之变化
    location.hash = `#${this.history[this.currentIndex]}`;
    // 执行指针目前指向hash路由对应的callback
    this.routes[this.history[this.currentIndex]]();
  }
}

```

上面看似可以实现`后退`的功能,但是验证的时候出现了bug,在后退的时候,我们需要点击两下.

分析一下这是因为:在执行`backOff`时,会触发`haschange`,从而会触发`refresh`所以导致`history`中会被`push`进新的路由,`currentIndex`也会向前移动.所以我们需要一个标记位,来在`haschange`触发`refresh`时区别是否是后退

```js

class Routers {
    constructor() {
        // 储存hash与callback键值对
        this.routes = {};
        // 当前hash
        this.currentUrl = '';
        // 记录出现过的hash
        this.history = [];
        // 作为指针,默认指向this.history的末尾,根据后退前进指向history中不同的hash
        this.currentIndex = this.history.length - 1;
        this.refresh = this.refresh.bind(this);
        this.backOff = this.backOff.bind(this);
        // 默认不是后退操作
        this.isBack = false;
        window.addEventListener('load', this.refresh, false);
        window.addEventListener('hashchange', this.refresh, false);
    }

    route(path, callback) {
        this.routes[path] = callback || function () {};
    }

    refresh() {
        this.currentUrl = location.hash.slice(1) || '/';
        if (!this.isBack) {
            // 如果不是后退操作,且当前指针小于数组总长度,直接截取指针之前的部分储存下来
            // 此操作来避免当点击后退按钮之后,再进行正常跳转,指针会停留在原地,而数组添加新hash路由
            // 避免再次造成指针的不匹配,我们直接截取指针之前的数组
            // 此操作同时与浏览器自带后退功能的行为保持一致
            if (this.currentIndex < this.history.length - 1)
                this.history = this.history.slice(0, this.currentIndex + 1);
            this.history.push(this.currentUrl);
            this.currentIndex++;
        }
        this.routes[this.currentUrl]();
        console.log('指针:', this.currentIndex, 'history:', this.history);
        this.isBack = false;
    }
    // 后退功能
    backOff() {
        // 后退操作设置为true
        this.isBack = true;
        this.currentIndex <= 0 ?
            (this.currentIndex = 0) :
            (this.currentIndex = this.currentIndex - 1);
        location.hash = `#${this.history[this.currentIndex]}`;
        this.routes[this.history[this.currentIndex]]();
    }
}

```

### HTML5新路由方案

3.1 history API

`history.pushState`用于在浏览器中添加历史记录,但是并不会触发跳转.

```js

history.pushState(state,title,url){
    // state: 与指定网址相关的追昂台对象,popstate事件触发时,该对象会传入回调参数.如果不需要该参数,可填null
    // title: 新网页的标题,但是所有浏览器都忽略这个值,因此填null即可
    // url: 新的网址,必须与当前页面处在同一个域.浏览器的地址栏将显示这个网址 
}

```

`history.replaceState`方法的参数与`pushState`一样,区别是它是修改浏览历史中当前的记录,而非添加记录.同样不会触发跳转

`popstate`事件,每当同一个文档的浏览历史(即history对象)出现变化时,就会触发这个事件

> 注意:仅仅是调用`pushState`或者`replaceState`方法不会触发该事件,只有当用户点击浏览器的倒退和前进按钮时,或者用JS调用`back`、`forward`、`go`方法时才会触发

> 另外,该事件只针对同一文档,如果浏览历史的切换,导致加载不同的文档,该事件也不会触发

3.2 新标准下路由的实现

```js

class Routers {
  constructor() {
    this.routes = {};
    // 在初始化时监听popstate事件
    this._bindPopState();
  }
  // 初始化路由
  init(path) {
    history.replaceState({path: path}, null, path);
    this.routes[path] && this.routes[path]();
  }
  // 将路径和对应回调函数加入hashMap储存
  route(path, callback) {
    this.routes[path] = callback || function() {};
  }

  // 触发路由对应回调
  go(path) {
    history.pushState({path: path}, null, path);
    this.routes[path] && this.routes[path]();
  }
  // 监听popstate事件
  _bindPopState() {
    window.addEventListener('popstate', e => {
      const path = e.state && e.state.path;
      this.routes[path] && this.routes[path]();
    });
  }
}

```