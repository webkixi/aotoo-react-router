import { Tabs } from 'aotoo-react-tabs'
require('aotoo-mixins-iscroll')
const Popstate = SAX('Popstate');
var _history = []
var _historyCount = 0
var _leftStack = []
var os

function _os(ua) {
  var ret = {},
    android = ua.match(/(?:Android);?[\s\/]+([\d.]+)?/),
    ios = ua.match(/(?:iPad|iPod|iPhone).*OS\s([\d_]+)/);
  ret.mobile = !!(android || ios)
  return ret;
}

let stat = true
function once(cb) {
  function next(params) {
    stat = true
  }
  if (stat) {
    stat = false
    cb(next)
  }

  // clearTimeout(mytimmer)
  // mytimmer = setTimeout(() => {
  //   if (stat) {
  //     stat = false
  //     cb(next)
  //   }
  // }, delay);
}

(function () {
  var anchorHash = false
  var anchorHref
  os = _os(navigator.userAgent)

  document.addEventListener('click', function (e) {
    var target = e.target
    if (target.nodeName == 'A') {
      anchorHash = false
      anchorHref = target.href
      anchorHash = target.href.indexOf('#') > -1 ? true : false
    }
  }, false)

  var blockPopstateEvent = document.readyState != "complete";
  window.addEventListener("load", function () {
    setTimeout(
      function () {
        blockPopstateEvent = false;
      },
      0)
  }, false)

  window.addEventListener("popstate", function (evt) {
    if (blockPopstateEvent && document.readyState == "complete") {
      evt.preventDefault()
      evt.stopImmediatePropagation()
    } else {
      if (anchorHash) {
        /* do something */
      } else {
        Popstate.emit('__goback');
      }
      anchorHref = ''
      anchorHash = false
    }
  }, false)
}())

function pushState(props, nohash) {
  const flag = props.flag ? (typeof props.flag == 'boolean' ? '#' : props.flag) : ''
  const uri = flag ? props.rootUrl + flag + props.key : props.rootUrl
  window.history.pushState(props, '', uri)
}

function _lru(max) {
  //https://github.com/dominictarr/hashlru
  if (!max) throw Error('hashlru must have a max value, of type number, greater than 0')
  var size = 0, cache = Object.create(null), _cache = Object.create(null)
  function update(key, value) {
    cache[key] = value
    size++
    if (size >= max) {
      size = 0
      _cache = cache
      cache = Object.create(null)
    }
  }
  return {
    has: function (key) {
      return cache[key] !== undefined || _cache[key] !== undefined
    },
    remove: function (key) {
      if (cache[key] !== undefined)
        cache[key] = undefined
      if (_cache[key] !== undefined)
        _cache[key] = undefined
    },
    get: function (key) {
      var v = cache[key]
      if (v !== undefined) return v
      if (v = _cache[key]) {
        update(key, v)
        return v
      }
    },
    set: function (key, value) {
      if (cache[key] !== undefined) cache[key] = value
      else update(key, value)
    },
    clear: function () {
      cache = Object.create(null)
      _cache = Object.create(null)
    }
  }
}


let lru = _lru(50)
let animatecss = {
  fade: {
    in: ' fadeIn animated-faster',
    rein: ' fadeIn animated-fastest',
    out: ' fadeOut contentHide animated-fastest',
    back: ' fadeOut contentHide animated-faster'
  },

  left: {
    in: ' fadeInLeft animated-faster',
    rein: ' fadeIn animated-fastest',
    out: ' fadeOut contentHide animated-fastest',
    back: ' fadeOutLeft contentHide animated-faster'
  },

  right: {
    in: ' fadeInRight animated-faster',
    rein: ' fadeIn animated-fastest',
    out: ' outHeight fadeOut contentHide animated-fastest',
    back: ' outHeight fadeOutRight contentHide animated-faster',
  }
}

let __opts
Aotoo.extend('router', function (opts, utile) {
  let dft = {
    storage: window.sessionStorage,
    likeApp: false,   // 模仿app的效果，比如动画切换，保持2个页面
    gap: 100,   // 两次点击之间的间隙延时时间，防止click多次响应
    props: {
      routerClass: 'routerGroup',
      mulitple: false
    }
  }
  opts = utile.merge(dft, opts)
  __opts = opts

  if (opts.animatecss) {
    animatecss = utile.merge(animatecss, opts.animatecss)
    delete opts.animatecss
  }

  const rootUrl = location.href.split('#')[0]
  class Router extends Tabs {
    constructor(props) {
      super(props)
      this.state = utile.merge(this.state, {
        flag: this.props.flag || '#',
        rootUrl: this.props.rootUrl || rootUrl,
        direction: 'goto',
        animate: this.props.animate || 'right'
      })
      this.prePageInfo

      if (this.state.animate) {
        const animateType = this.state.animate  // fade, left, right
        this.animatein = animatecss[animateType]['in']
        this.animaterein = animatecss[animateType]['rein']
        this.animateout = animatecss[animateType]['out']
        this.animateback = animatecss[animateType]['back']
      }

      this.historyPush = this.historyPush.bind(this)
      this.getRealContent = this.getRealContent.bind(this)
      this.findPath = this.findPath.bind(this)
    }

    componentWillMount() {
      super.componentWillMount()
      const that = this
      const menuData = this.saxer.get().MenuData
      const contentData = this.saxer.get().ContentData
      const selectItem = menuData[this.state.select]


      this.on('historypush', function (opts) {
        const _path = opts.path
        const _data = opts.data
        const historyItem = that.findPath(_path)

        that.historyPush({
          index: historyItem.index,
          key: historyItem.path,
          data: _data || {}
        })
      })

      this.on('historypop', function (opts) {
        return that.historyPop(opts)
      })

      this.emit('historypush', {
        path: this.state.select,
        data: {}
      })
    }

    findPath(where) {
      const type = typeof where
      const menu_data = this.saxer.get().MenuData
      if (type == 'number') {
        return menu_data[where]
      }
      if (type == 'string') {
        return utile.find(menu_data, { path: where })
      }
    }

    historyPush(props) {
      if (this.state.flag) {
        const curHistoryState = window.history.state
        pushState({
          index: props.index,
          key: props.key,
          path: props.key,
          data: props.data,
          rootUrl: this.state.rootUrl,
          preState: curHistoryState,
          timeLine: _historyCount,
          flag: this.state.flag
        })
      } else {
        pushState({
          rootUrl: this.state.rootUrl,
          flag: this.state.flag
        }, true)
      }
      const preState = _history[_history.length - 1]
      _history.push({
        index: props.index,
        key: props.key,
        path: props.key,
        data: props.data,
        preState: preState,
        timeLine: _historyCount
      })

      _historyCount++
    }

    historyPop() {
      let state = _history.pop()
      if (!state) return false
      let rightState;
      if (this.state.flag) {
        rightState = (state && state.preState)
        if (rightState) {
          pushState({
            index: rightState.index,
            key: rightState.key,
            data: rightState.data,
            rootUrl: this.state.rootUrl,
            preState: "curHistoryState",
            flag: this.state.flag
          })
        }
      } else {
        rightState = _history.pop()
        pushState({ rootUrl: this.state.rootUrl, flag: this.state.flag }, true)
      }

      return rightState
    }

    getRealContent(cnt, pre) {
      if (!cnt) return ' '
      let InstanceContext = this.saxer.get().InstanceContext || {}
      let _pre = this.findPath(pre)
      InstanceContext.from = (function () {
        if (_pre) {
          return {
            index: _pre.index,
            path: _pre.path,
            title: _pre.title,
            idf: _pre.idf,
            parent: _pre.parent,
            attr: _pre.attr
          }
        }
      })()
      const selectData = this.state.selectData
      if (typeof cnt == 'function') {
        let result = cnt(InstanceContext)
        if (typeof result == 'object') {
          if (result['$$typeof']) return result

          // enter, leave, main, loaded
          if (typeof result.enter == 'function') return result.enter(selectData)
          else if (typeof result.main == 'function') {
            return result.main(selectData)
          }
        }
      }
      return cnt
    }

    getPage(boxCls) {
      const id = this.state.select
      let pre, preId, prePage, preContent
      let oriContent, content
      oriContent = this.getContent(id)

      if (this.state.direction == 'jumpback') {
        // content = lru.get(id)
        // if (!content) {
        //   oriContent = this.getContent(id)
        //   content = this.getRealContent(oriContent)
        // }

        pre = _leftStack.length ? _leftStack[_leftStack.length - 1] : '';
        let rightIndex = _.findLastIndex(_history, function (o) { return o.index == id })
        if (rightIndex > -1) {
          rightIndex += 1
          _history = _history.slice(0, rightIndex)
          _leftStack = _leftStack.slice(0, (rightIndex))
        }
      }
      else
        if (this.state.direction == 'back') {
          pre = _leftStack.pop()
        } else {
          pre = _leftStack.length ? _leftStack[_leftStack.length - 1] : '';
        }

      if (this.state.animate) {
        if (this.state.animate == 'fade' || !dft.likeApp) {
          // prePage = <div ref='prePage' key={utile.uniqueId('Router_Single_')} className={boxCls} />
          prePage = undefined
        } else {
          if (pre && pre.id !== id) {
            // this.prePageInfo = pre
            // preContent = this.getRealContent(this.getContent(pre.id))

            this.prePageInfo = pre
            preContent = lru.get(pre.id)
            if (!preContent) {
              preContent = this.getRealContent(this.getContent(pre.id))
            }

            prePage = <div ref='prePage' key={utile.uniqueId('Router_Single_')} className={boxCls}>{preContent}</div>
          }
        }
      }

      content = this.getRealContent(oriContent, pre)

      const curPage = <div
        ref="curPage"
        key={utile.uniqueId('Router_Single_')}
        className={boxCls}>
        {content}
      </div>

      // 下面的部分有顺序要求，不能随意放置
      if (this.state.direction == 'goto') {
        _leftStack.push({
          id: id,
          // origin: oriContent
          // content: content,
        })
      }

      lru.set(id, content)

      if (prePage) {
        // return [ prePage, curPage ]  //暂时屏蔽前一页
        return [ curPage ]
      } else {
        return [ curPage ]
      }
    }

    leaveContent() {
      if (this.prePageInfo) {
        const InstanceContext = this.saxer.get().InstanceContext
        const _pre = this.prePageInfo.origin
        if (typeof _pre == 'function') {
          let result = _pre(InstanceContext)
          if (typeof result == 'object') {
            if (typeof result.leave == 'function') return result.leave()
          }
        }
      }
    }

    componentDidMount() {
      let animatein = this.animatein
      let animateout = this.animateout
      if (this.state.direction == 'back' || this.state.direction == 'jumpback') {
        animateout = this.animateback
        animatein = this.animaterein
      }
      const curPageDom = this.refs.curPage
      const prePageDom = this.refs.prePage
      if (curPageDom) {
        curPageDom.classList.value += animatein
      }
      if (prePageDom) {
        prePageDom.classList.value += animateout
      }
      this.leaveContent()
    }

    componentDidUpdate(prevProps, prevState) {
      // this.leaveContent()
    }

    render() {
      const cls = !this.props.routerClass ? 'routerGroup ' : 'routerGroup ' + this.props.routerClass
      // const boxes_cls = !this.props.mulitple ? 'routerBoxes' : 'routerBoxes mulitple'
      const boxes_cls = !this.props.mulitple ? (this.props.animate == 'left' ? 'routerBoxes boxLeft' : this.props.animate == 'right' ? 'routerBoxes boxRight' : 'routerBoxes') : 'routerBoxes mulitple'

      const jsxMenu = this.saxer.get().MenuJsx
      const content = this.getPage(boxes_cls)
      const IscrollTreeMenu = Aotoo.iscroll(<div className='routerMenus'>{jsxMenu}</div>, {
        onscroll: function () { },
        onscrollend: function () { }
      })

      return (
        <div className={cls}>
          {this.state.showMenu ? <IscrollTreeMenu /> : ''}
          {content}
        </div>
      )
    }
  }

  const Action = {
    UPDATE: function (ostate, opts, ctx) {
      let state = this.curState
      state.data = opts.data
      return state
    },

    SELECT: function (ostate, opts, ctx) {
      let state = this.curState

      // select
      state.select = opts.select

      // selectData
      if (opts.selectData) {
        state.selectData = opts.selectData
      }

      if (opts.direction) {
        state.direction = opts.direction || 'goto'
      }

      if (state.direction == 'goto') {
        ctx.emit('historypush', {
          path: state.select,
          data: state.selectData
        })
      }

      if (typeof opts.cb == 'function') {
        setTimeout(function () { opts.cb() }, 100);
      }

      return state
    },
  }

  // const router = Aotoo(Tabs, Action, dft)
  const router = Aotoo(Router, Action, dft)
  router.condition = {
    preback: 'preback'
  }

  router.saxer.append({
    InstanceContext: router
  })

  Popstate.on('__goback', function (param) {
    return router.back()

    // let hash
    // if (param.href.indexOf('#')>-1) {
    //   hash = param.href.substr(param.href.indexOf('#')+1)
    // }
    // // if (!hash) {
    // //   return router.back()
    // // }
    // if (hash) {
    //   const lastItem = _history[(_history.length - 1)]
    //   if (hash !== lastItem.path) {
    //     return router.back()
    //   }
    // }
  })

  let timmer = {
    goto: '',
    back: ''
  }

  router.extend({
    getWhereInfo: function (where) {
      const menu_data = this.saxer.get().MenuData
      return utile.find(menu_data, { path: where })
    },
    getHistory: function (params) {
      return _history
    },
    setHistory: function (record) {
      if (record) {
        _history = record.history || _history
        _leftStack = record.stack || _leftStack
      }
    },
    clearHistory: function (params) {
      _history = []
      _leftStack = []
    },
    start: function (id, data) {
      if (this.hasMounted()) {
        this.goto(id, data)
      } else {
        if (this.config && this.config.props) {
          this.config.props.select = id
          this.config.props.selectData = data
        }
      }
    },
    delete: function () {
      let sessName
      if (this.storageName) {
        sessName = this.storageName
        if (dft.storage[sessName]) {
          dft.storage.removeItem(sessName)
          return true
        }
      }
    },
    save: function (name, params) {
      let sessName
      if (name) {
        sessName = name
        const his = JSON.stringify(_history)
        const stack = JSON.stringify(_leftStack)
        const cur = _history[_history.length - 1]

        const sessData = {
          from: window.location,
          history: _history,
          stack: _leftStack,
          current: cur
        }
        this.storageName = sessName
        dft.storage.setItem(sessName, JSON.stringify(sessData))
      }
    },
    restore: function (name, params) {
      let sessName
      if (name) {
        // sessName = name + '_' + this.globalName
        sessName = name
        if (dft.storage[sessName]) {
          const sessData = JSON.parse(dft.storage[sessName])
          dft.storage.removeItem(sessName)

          if (sessData.history.length) {
            var cur = {
              page: sessData.history.pop(),
              stack: sessData.stack.pop()
            }

            _history = sessData.history
            _leftStack = sessData.stack

            // _history.pop()
            // _leftStack.pop()
            this.start(
              cur.page.path,
              cur.page.data
            )
  
            return true
          }
        }
      }
    },

    goto: function (where, data) {
      once( next => {
        setTimeout(() => {
          next()
        }, __opts.gap);

        const result_beforegoto = this.emit('_beforeGoto', {
          record: {
            history: _history,
            // stack: _leftStack,
          },
          param: {
            path: where,
            data: data
          },

          setHistory: this.setHistory
        })
        this.off('_beforeGoto')

        const resultBeforegoto = this.emit('beforeGoto', {
          record: {
            history: _history,
            // stack: _leftStack,
          },

          param: {
            path: where,
            data: data
          },

          setHistory: this.setHistory
        })

        if (result_beforegoto) return
        if (resultBeforegoto) return

        if (typeof where != 'string') return
        const target = this.getWhereInfo(where)
        if (target) {
          this.$select({
            select: target.index,
            selectData: data,
            direction: 'goto'
          })
        }
      })
    },

    back: function (where, data) {
      once( next => {
        setTimeout(() => {
          next()
        }, __opts.gap);
        
        const result_beforeback = this.emit('_beforeBack', {
          record: {
            history: _history,
            // stack: _leftStack,
          },
          param: {
            path: where,
            data: data
          },
          setHistory: this.setHistory
        })
  
        this.off('_beforeBack')
  
        const resultBeforeback = this.emit('beforeBack', {
          record: {
            history: _history,
            // stack: _leftStack,
          },
          param: {
            path: where,
            data: data
          },
          setHistory: this.setHistory
        })
  
        if (result_beforeback) return
        if (resultBeforeback) return
  
        let condition = {}
        if (this.hasOn('preback')) {
          const h = _history[_history.length - 1]
          const whereami = {
            index: h.index,
            path: h.path,
            data: h.data,
            pre: h.preState,
            flag: h.flag
          }
          condition = this.emit('preback', whereami)
          if (!condition) return
        }
        if (where) {
          if (typeof where != 'string') return
          const target = this.getWhereInfo(where)
          if (target) {
            this.$select({
              select: target.index,
              selectData: utile.merge({}, data, condition),
              direction: 'jumpback'
            })
          }
        } else {
          const whereBack = this.emit('historypop')
          // whereBack: {
          // index: props.index,
          // key: props.key,
          // data: props.data,
          // rootUrl: this.state.rootUrl,
          // preState: curHistoryState,
          // timeLine: _historyCount,
          // flag: this.state.flag
          //}
          if (whereBack) {
            this.$select({
              select: whereBack.index,
              selectData: utile.merge({}, whereBack.data, condition),
              direction: 'back'
            })
            return whereBack
          } else {
            if (window.history.length) {
              history.back()
            } else {
              pushState({ rootUrl: rootUrl }, true)
            }
          }
        }
      })
    }
  })

  return router
})