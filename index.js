/**
 * 参考
 * 浏览器“ 后退”、“ 前进” 或可以这么去监听  http://seejs.me/2016/10/19/goback/
 */

import { Tabs } from 'aotoo-react-tabs'
require('aotoo-mixins-iscroll')
const Popstate = SAX('Popstate');
var _history = []
var _historyCount = 0
var _leftStack = []
var os

Aotoo.inject.css(`
  .progress-slot {
    width: 100%;
    height: 2px;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
  }

  .progress-stat {
    background-color: #ccc;
    width: 0;
    height: 2px;
    padding: 0;
    margin: 0;
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
  }
`)

function ProgressFun(props) {
  let _props = _.merge({}, props)
  if (_props.style && _props.style.enable) delete _props.style.enable
  return (
    <div className="progress-slot">
      <div className="progress-stat" style={_props.style||{width: '0'}}></div>
    </div>
  )
}

class ProgressClass extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      width: this.props.width || {width: '0'},
      opacity: '1',
      backgroundColor: this.props.backgroundColor,
      height: this.props.height,
      enable: true
    }
  }
  render(){
    if (this.props.enable) {
      return <ProgressFun style={this.state}/>
    } else {
      return <ProgressFun style={{height: '0'}}/>
    }
  }
}

const Progress = Aotoo(ProgressClass, {
  WIDTH: function(ostate, opts) {
    let state = this.curState
    state.width = opts.width
    return state
  },
  OPACITY: function (ostate, opts) {
    let state = this.curState
    state.opacity = opts.opacity
    return state
  }
})

function _os(ua) {
  var ret = {},
    android = ua.match(/(?:Android);?[\s\/]+([\d.]+)?/),
    ios = ua.match(/(?:iPad|iPod|iPhone).*OS\s([\d_]+)/);
  ret.mobile = !!(android || ios)
  return ret;
}

let stat = true
function next(params) {
  stat = true
}
function once(cb) {
  if (stat) {
    stat = false
    const id = this.saxer.get('__id')
    const operateId = id + '_OPERATE'
    const operate = this.saxer.get(operateId)
    Progress.$width({width: "70%"})
    if (operate) {
      if (operate == 'break') return   // continue will dealwith flow code
      else {
        this.saxer.set(operateId, 'break')
      }
    } else {
      this.saxer.set(operateId, 'break')
    }
    setTimeout(() => {
      this.saxer.set(operateId, 'continue')
      stat = true
    }, 1000);
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

function _pushState(props, nohash) {
  const flag = props.flag ? (typeof props.flag == 'boolean' ? '#' : props.flag) : ''
  const init = props.init  // 是否是第一次触发
  const instProps = props.config.props || {}
  delete props.config

  const rawurl = props.toggleUrl ? (()=>{
    return !instProps.rawurl
  })() : instProps.rawurl

  // const uri = flag ? props.rootUrl + flag + props.key : props.rootUrl
  const cleanUri = flag ? props.rootUrl + flag + props.key : props.rootUrl
  const completeUri = init ? window.location.href : (()=>{
    let query = ''
    if (props.data && Aotoo.isPlainObject(props.data)) {
      const datas = Object.keys(props.data)
      if (datas.length) {
        query = '?'
        datas.forEach((key, ii)=>{
          if (ii<datas.length) {
            if (ii+1==datas.length) {
              query += (key+"="+props.data[key])
            } else {
              query += (key+"="+props.data[key]+'&')
            }
          }
        })
      }
    }
    return cleanUri + query
  })()
  const uri = rawurl ? completeUri : cleanUri

  if (init) {
    if (!rawurl) window.history.pushState(props, '', uri)
  } else {
    window.history.pushState(props, '', uri)
  }
}

function pushState(props, nohash) {
  if (props) {
    if (props.direction && props.direction == 'back') {
      delete props.config
      const uri = props.href || props.rootUrl
      window.history.pushState(props, '', uri)
    } else {
      _pushState(props, nohash)
    }
  }
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
      if(cache[key] !== undefined)
        cache[key] = undefined
      if(_cache[key] !== undefined)
        _cache[key] = undefined
    },
    get: function (key) {
      var v = cache[key]
      if(v !== undefined) return v
      if((v = _cache[key]) !== undefined) {
        update(key, v)
        return v
      }
    },
    set: function (key, value) {
      if(cache[key] !== undefined) cache[key] = value
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
    progress: {
      backgroundColor: '#108ee9',
      enable: true
    },
    likeApp: false,   // 模仿app动画切换，保持2个页面, 置为false 可暂时停止prepage页面，提升性能
    gap: 300,   // 两次点击之间的间隙延时时间，防止click多次响应
    props: {
      rawurl: false,  // 影响pushstat操作，true: 保持原始的url地址，false: 切换为精简版url地址。原始地址可以在url上显示query等参数
      routerClass: 'routerGroup',
      mulitple: false
    },
    iscrollConfig: {}  // 导航栏的iscroll滚动参数设置
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
          data: _data || {},
          init: opts.init, // 第一次访问。当直接从url访问时，需不需要对window.history做操作
          toggleUrl: opts.toggleUrl   // 通过goto, back方法手动控制pushstat地址干净与否
        })
      })

      this.on('historypop', function (opts) {
        return that.historyPop(opts)
      })


      // 第一次访问的数据来自url或者传递过来的selectData
      const selectData = (()=>{
        let query
        let search = window.location.search
        if (search) {
          search = search.substring(1)
          if (search.length) {
            query = {}
            search.split('&').forEach(function(item) {
              const parts = item.split('=')
              if (parts.length == 1) {
                query[parts[0]] = true
              } else {
                query[parts[0]] = parts[1]
              }
            })
          }
          if (query) return query
        }
        return undefined
      })() || this.state.selectData || {}
      this.emit('historypush', {
        path: this.state.select,
        data: selectData,
        init: true
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
      const curHref = window.location.href
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
          flag: this.state.flag,
          config: this.config,
          init: props.init,
          toggleUrl: props.toggleUrl
        })
      } else {
        pushState({
          rootUrl: this.state.rootUrl,
          flag: this.state.flag,
          config: this.config,
          init: props.init
        }, true)
      }
      const preState = _history[_history.length - 1]
      _history.push({
        index: props.index,
        key: props.key,
        path: props.key,
        data: props.data,
        preState: preState,
        preHref: curHref,
        timeLine: _historyCount
      })

      _historyCount++
    }

    historyPop() {
      let state = _history.pop()
      if (!state) return false
      let rightState;
      let rightHref
      if (this.state.flag) {
        rightState = (state && state.preState)
        rightHref = (state && state.preHref)
        if (rightState) {
          pushState({
            index: rightState.index,
            key: rightState.key,
            data: rightState.data,
            rootUrl: this.state.rootUrl,
            href: rightHref,
            preState: "curHistoryState",
            flag: this.state.flag,
            config: this.config,
            direction: 'back'
          })
        }
      } else {
        rightState = _history.pop()
        pushState({ 
          rootUrl: this.state.rootUrl, 
          flag: this.state.flag,
          config: this.config,
          direction: 'back'
        }, 
        true)
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
      // const xxid = this.saxer.get('__id')
      // const operateId = xxid + '_OPERATE'
      // const operate = this.saxer.get(operateId)

      const id = this.state.select;
      let pre, preId, prePage, preContent;
      let oriContent, content;
      oriContent = this.getContent(id);

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
        if (this.state.animate == 'fade' || !opts.likeApp) {
          prePage = undefined
          this.prePageInfo = (pre && pre.id !== id) ? { origin: this.getContent(pre.id), ...pre} : ''
        } else {
          if (pre && pre.id !== id) {
            this.prePageInfo = { origin: this.getContent(pre.id), ...pre}
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
        })
      }

      lru.set(id, content)

      // if (operate == 'break') {
      //   setTimeout(() => {
      //     Progress.$width({width: "100%"})
      //     setTimeout(() => {
      //       Progress.$opacity({opacity: "0"})
      //       setTimeout(() => {
      //         Progress.$width({width: "0"})
      //         setTimeout(() => {
      //           Progress.$opacity({opacity: "1"})
      //         }, 200);
      //       }, 400);
      //     }, 500);
      //   }, 1000);
      //   this.saxer.set(operateId, 'continue')
      // }

      if (prePage) {
        return [ prePage, curPage ]
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

    render() {
      const cls = !this.props.routerClass ? 'routerGroup ' : 'routerGroup ' + this.props.routerClass
      const boxes_cls = !this.props.mulitple ? (this.props.animate == 'left' ? 'routerBoxes boxLeft' : this.props.animate == 'right' ? 'routerBoxes boxRight' : 'routerBoxes') : 'routerBoxes mulitple'
      const jsxMenu = this.createMenu()

      const content = this.getPage(boxes_cls)
      const IscrollTreeMenu = Aotoo.iscroll(
        <div className='routerMenus'>{jsxMenu}</div>, 
        opts.iscrollConfig
      )

      return (
        <div className={cls}>
          <Progress.x {...opts.progress}/>
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
          data: state.selectData,
          init: opts.init,
          toggleUrl: opts.toggleUrl
        })
      }

      if (typeof opts.cb == 'function') {
        setTimeout(function () { opts.cb() }, 100);
      }

      return state
    },
  }

  // const router = Aotoo(Tabs, Action, dft)
  let router = Aotoo(Router, Action, dft)
  router.__id = _.uniqueId('ROUTER_ID_')
  router.saxer.set('__id', router.__id)
  router.condition = {
    preback: 'preback'
  }
  
  router.on('rendered', function(params) {
    const {context} = params
    const xxid = context.saxer.get('__id')
    const operateId = xxid + '_OPERATE'
    const operate = context.saxer.get(operateId)

    if (operate == 'break') {
      setTimeout(() => {
        Progress.$width({width: "100%"})
        setTimeout(() => {
          Progress.$opacity({opacity: "0"})
          setTimeout(() => {
            Progress.$width({width: "0"})
            setTimeout(() => {
              Progress.$opacity({opacity: "1"})
              context.saxer.set(operateId, 'continue')
            }, 200);
          }, 100);
        }, 100);
      }, 500);
    }
  })

  router.saxer.append({
    InstanceContext: router
  })

  router.progress = {
    start: function(param) {
      if (typeof param == 'object' && param.width) {
        Progress.$width(param)
      }
    },
    end: function(timeout=1000) {
      Progress.$width({width: "100%"})
      setTimeout(() => {
        Progress.$opacity({opacity: "0"})
        setTimeout(() => {
          Progress.$width({width: "0"})
        }, 300);
      }, timeout);
    }
  }

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
        this.goto(id, data, {init: true})
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

    goto: function (where, data, opts={}) {
      once.call(this, next => {
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
            direction: 'goto',
            init: opts.init,   // 是否是第一次启动，从inst.start进入，第一次进入不会触发pushstat更改window.history状态
            toggleUrl: opts.toggleUrl
          })
        }
      })
    },

    back: function (where, data) {
      once.call(this, next => {
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
            if (_history.length == 1) {
              _history = []
              _leftStack = []
              history.back()
            }
            // return whereBack
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