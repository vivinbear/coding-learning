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