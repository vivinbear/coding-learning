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

function diff(oldDomTree, newDomTree) {
    let patches = {}
    dfs(oldDomTree, newDomTree, 0, patches)
    return patches
}

function dfs(oldNode, newNode, index, patches) {
    // 用于保存当前子数的差异
    let curPatches = []
    // 三种情况
    // 1. 没有新节点,什么都不做
    // 2. 新旧节点的tag和key不同,直接用新节点替换旧节点
    // 3. 新旧节点的tag和key相同,对比其子节点的
    if (!newNode) {

    } else if (newNode.tag !== oldNode.tag) {
        curPatches.push({ type: StateEnums.Replace, node: newNode })
    }
    else if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
        // 先对比节点的属性,查看属性是否有变更
        let props = diffProps(oldNode.props, newNode.props)
        if (props.length) curPatches.push({ type: StateEnums.ChangeProps, props })
        // 遍历子节点
        diffChildren(oldNode.children, newNode.children, index, patches)
    }
    if (curPatches.length) {
        if (patches[index]) {
            patches[index] = patches[index].concat(curPatches)
        } else {
            patches[index] = curPatches
        }
    }
}