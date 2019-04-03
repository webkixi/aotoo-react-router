"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function ProgressFun(t){var e=_.merge({},t);return e.style&&e.style.enable&&delete e.style.enable,React.createElement("div",{className:"progress-slot"},React.createElement("div",{className:"progress-stat",style:e.style||{width:"0"}}))}function _os(t){var e={},i=t.match(/(?:Android);?[\s\/]+([\d.]+)?/),o=t.match(/(?:iPad|iPod|iPhone).*OS\s([\d_]+)/);return e.mobile=!(!i&&!o),e}function next(t){stat=!0}function once(t){var e=this;if(stat){stat=!1;var i=this.saxer.get("__id")+"_OPERATE",o=this.saxer.get(i);if(Progress.$width({width:"70%"}),o){if("break"==o)return;this.saxer.set(i,"break")}else this.saxer.set(i,"break");setTimeout(function(){e.saxer.set(i,"continue"),stat=!0},1e3),t(next)}}function _pushState(t,e){var i=t.flag?"boolean"==typeof t.flag?"#":t.flag:"",o=t.init,r=t.config.props||{};delete t.config;var a=t.toggleUrl?!r.rawurl:r.rawurl,n=i?t.rootUrl+i+t.key:t.rootUrl,s=o?window.location.href:function(){var e="";if(t.data&&Aotoo.isPlainObject(t.data)){var i=Object.keys(t.data);i.length&&(e="?",i.forEach(function(o,r){r<i.length&&(r+1==i.length?e+=o+"="+t.data[o]:e+=o+"="+t.data[o]+"&")}))}return n+e}(),c=a?s:n;o?a||window.history.pushState(t,"",c):window.history.pushState(t,"",c)}function pushState(t,e){if(t)if(t.direction&&"back"==t.direction){delete t.config;var i=t.href||t.rootUrl;window.history.replaceState(t,"",i)}else _pushState(t,e)}function _lru(t){function e(e,a){o[e]=a,++i>=t&&(i=0,r=o,o=Object.create(null))}if(!t)throw Error("hashlru must have a max value, of type number, greater than 0");var i=0,o=Object.create(null),r=Object.create(null);return{has:function(t){return void 0!==o[t]||void 0!==r[t]},remove:function(t){void 0!==o[t]&&(o[t]=void 0),void 0!==r[t]&&(r[t]=void 0)},get:function(t){var i=o[t];return void 0!==i?i:void 0!==(i=r[t])?(e(t,i),i):void 0},set:function(t,i){void 0!==o[t]?o[t]=i:e(t,i)},clear:function(){o=Object.create(null),r=Object.create(null)}}}var _extends=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o])}return t},_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_get=function t(e,i,o){null===e&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,i);if(void 0===r){var a=Object.getPrototypeOf(e);return null===a?void 0:t(a,i,o)}if("value"in r)return r.value;var n=r.get;if(void 0!==n)return n.call(o)},_createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var o=e[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,i,o){return i&&t(e.prototype,i),o&&t(e,o),e}}(),_aotooReactTabs=require("aotoo-react-tabs");require("aotoo-mixins-iscroll");var Popstate=SAX("Popstate"),_history=[],_historyCount=0,_leftStack=[],_restoreStat=!1,os;Aotoo.inject.css("\n  .progress-slot {\n    width: 100%;\n    height: 2px;\n    padding: 0;\n    margin: 0;\n    position: absolute;\n    top: 0;\n    left: 0;\n    z-index: 999;\n  }\n\n  .progress-stat {\n    background-color: #ccc;\n    width: 0;\n    height: 2px;\n    padding: 0;\n    margin: 0;\n    -webkit-transition: all .2s ease-in-out;\n    transition: all .2s ease-in-out;\n  }\n");var ProgressClass=function(t){function e(t){_classCallCheck(this,e);var i=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t));return i.state={width:i.props.width||{width:"0"},opacity:"1",backgroundColor:i.props.backgroundColor,height:i.props.height,enable:!0},i}return _inherits(e,React.Component),_createClass(e,[{key:"render",value:function(){return this.props.enable?React.createElement(ProgressFun,{style:this.state}):React.createElement(ProgressFun,{style:{height:"0"}})}}]),e}(),Progress=Aotoo(ProgressClass,{WIDTH:function(t,e){var i=this.curState;return i.width=e.width,i},OPACITY:function(t,e){var i=this.curState;return i.opacity=e.opacity,i}}),stat=!0;!function(){var t,e=!1;os=_os(navigator.userAgent),document.addEventListener("click",function(i){var o=i.target;"A"==o.nodeName&&(e=!1,t=o.href,e=o.href.indexOf("#")>-1)},!1);var i="complete"!=document.readyState;window.addEventListener("load",function(){setTimeout(function(){i=!1},0)},!1),window.addEventListener("popstate",function(o){i&&"complete"==document.readyState?(o.preventDefault(),o.stopImmediatePropagation()):(e||Popstate.emit("__goback"),t="",e=!1)},!1)}();var lru=_lru(50),animatecss={fade:{in:" fadeIn animated-faster",rein:" fadeIn animated-fastest",out:" fadeOut contentHide animated-fastest",back:" fadeOut contentHide animated-faster"},left:{in:" fadeInLeft animated-faster",rein:" fadeIn animated-fastest",out:" fadeOut contentHide animated-fastest",back:" fadeOutLeft contentHide animated-faster"},right:{in:" fadeInRight animated-faster",rein:" fadeIn animated-fastest",out:" outHeight fadeOut contentHide animated-fastest",back:" outHeight fadeOutRight contentHide animated-faster"}},__opts=void 0;Aotoo.extend("router",function(t,e){var i={storage:window.sessionStorage,progress:{backgroundColor:"#108ee9",enable:!0},likeApp:!1,gap:300,props:{rawurl:!1,routerClass:"routerGroup",mulitple:!1},iscrollConfig:{}};t=e.merge(i,t),__opts=t,t.animatecss&&(animatecss=e.merge(animatecss,t.animatecss),delete t.animatecss);var o=location.href.split("#")[0],r=function(i){function r(t){_classCallCheck(this,r);var i=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,t));if(i.state=e.merge(i.state,{flag:i.props.flag||"#",rootUrl:i.props.rootUrl||o,direction:"goto",animate:i.props.animate||"right"}),i.prePageInfo,i.state.animate){var a=i.state.animate;i.animatein=animatecss[a].in,i.animaterein=animatecss[a].rein,i.animateout=animatecss[a].out,i.animateback=animatecss[a].back}return i.historyPush=i.historyPush.bind(i),i.getRealContent=i.getRealContent.bind(i),i.findPath=i.findPath.bind(i),i}return _inherits(r,_aotooReactTabs.Tabs),_createClass(r,[{key:"componentWillMount",value:function(){_get(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"componentWillMount",this).call(this);var t=this,e=this.saxer.get().MenuData;this.saxer.get().ContentData,e[this.state.select];this.on("historypush",function(e){var i=e.path,o=e.data,r=t.findPath(i);t.historyPush({index:r.index,key:r.path,data:o||{},init:e.init,toggleUrl:e.toggleUrl})}),this.on("historypop",function(e){return t.historyPop(e)});var i=function(){var t=void 0,e=window.location.search;if(e&&((e=e.substring(1)).length&&(t={},e.split("&").forEach(function(e){var i=e.split("=");1==i.length?t[i[0]]=!0:t[i[0]]=i[1]})),t))return t}()||this.state.selectData||{};_restoreStat||this.emit("historypush",{path:this.state.select,data:i,init:!0}),_restoreStat=!1}},{key:"findPath",value:function(t){var i=void 0===t?"undefined":_typeof(t),o=this.saxer.get().MenuData;return"number"==i?o[t]:"string"==i?e.find(o,{path:t}):void 0}},{key:"historyPush",value:function(t){var e=window.location.href;if(this.state.flag){var i=window.history.state;pushState({index:t.index,key:t.key,path:t.key,data:t.data,rootUrl:this.state.rootUrl,preState:i,timeLine:_historyCount,flag:this.state.flag,config:this.config,init:t.init,toggleUrl:t.toggleUrl})}else pushState({rootUrl:this.state.rootUrl,flag:this.state.flag,config:this.config,init:t.init},!0);var o=_history[_history.length-1];_history.push({index:t.index,key:t.key,path:t.key,data:t.data,preState:o,preHref:e,timeLine:_historyCount}),_historyCount++}},{key:"historyPop",value:function(){var t=_history.pop();if(!t)return!1;var e=void 0,i=void 0;return this.state.flag?(e=t&&t.preState,i=t&&t.preHref,e&&pushState({index:e.index,key:e.key,data:e.data,rootUrl:this.state.rootUrl,href:i,preState:"curHistoryState",flag:this.state.flag,config:this.config,direction:"back"})):(e=_history.pop(),pushState({rootUrl:this.state.rootUrl,flag:this.state.flag,config:this.config,direction:"back"},!0)),e}},{key:"getRealContent",value:function(t,e){if(!t)return" ";var i=this.saxer.get().InstanceContext||{},o=this.findPath(e);i.from=function(){if(o)return{index:o.index,path:o.path,title:o.title,idf:o.idf,parent:o.parent,attr:o.attr}}();var r=this.state.selectData;if("function"==typeof t){var a=t(i);if("object"==(void 0===a?"undefined":_typeof(a))){if(a.$$typeof)return a;if("function"==typeof a.enter)return a.enter(r);if("function"==typeof a.main)return a.main(r)}}return t}},{key:"getPage",value:function(i){var o=this.state.select,r=void 0,a=void 0,n=void 0,s=void 0,c=void 0;if(s=this.getContent(o),"jumpback"==this.state.direction){r=_leftStack.length?_leftStack[_leftStack.length-1]:"";var l=_.findLastIndex(_history,function(t){return t.index==o});l>-1&&(l+=1,_history=_history.slice(0,l),_leftStack=_leftStack.slice(0,l))}else r="back"==this.state.direction?_leftStack.pop():_leftStack.length?_leftStack[_leftStack.length-1]:"";this.state.animate&&("fade"!=this.state.animate&&t.likeApp?r&&r.id!==o&&(this.prePageInfo=_extends({origin:this.getContent(r.id)},r),(n=lru.get(r.id))||(n=this.getRealContent(this.getContent(r.id))),a=React.createElement("div",{ref:"prePage",key:e.uniqueId("Router_Single_"),className:i},n)):(a=void 0,this.prePageInfo=r&&r.id!==o?_extends({origin:this.getContent(r.id)},r):"")),c=this.getRealContent(s,r);var u=React.createElement("div",{ref:"curPage",key:e.uniqueId("Router_Single_"),className:i},c);return"goto"==this.state.direction&&_leftStack.push({id:o}),lru.set(o,c),a?[a,u]:[u]}},{key:"leaveContent",value:function(){if(this.prePageInfo){var t=this.saxer.get().InstanceContext,e=this.prePageInfo.origin;if("function"==typeof e){var i=e(t);if("object"==(void 0===i?"undefined":_typeof(i))&&"function"==typeof i.leave)return i.leave()}}}},{key:"componentDidMount",value:function(){var t=this.animatein,e=this.animateout;"back"!=this.state.direction&&"jumpback"!=this.state.direction||(e=this.animateback,t=this.animaterein);var i=this.refs.curPage,o=this.refs.prePage;i&&(i.classList.value+=t),o&&(o.classList.value+=e),this.leaveContent()}},{key:"render",value:function(){var e=this.props.routerClass?"routerGroup "+this.props.routerClass:"routerGroup ",i=this.props.mulitple?"routerBoxes mulitple":"left"==this.props.animate?"routerBoxes boxLeft":"right"==this.props.animate?"routerBoxes boxRight":"routerBoxes",o=this.createMenu(),r=this.getPage(i),a=Aotoo.iscroll(React.createElement("div",{className:"routerMenus"},o),t.iscrollConfig);return React.createElement("div",{className:e},React.createElement(Progress.x,t.progress),this.state.showMenu?React.createElement(a,null):"",r)}}]),r}(),a={UPDATE:function(t,e,i){var o=this.curState;return o.data=e.data,o},SELECT:function(t,e,i){var o=this.curState;return o.select=e.select,e.selectData&&(o.selectData=e.selectData),e.direction&&(o.direction=e.direction||"goto"),"goto"==o.direction&&i.emit("historypush",{path:o.select,data:o.selectData,init:e.init,toggleUrl:e.toggleUrl}),"function"==typeof e.cb&&setTimeout(function(){e.cb()},100),o}},n=Aotoo(r,a,i);n.__id=_.uniqueId("ROUTER_ID_"),n.saxer.set("__id",n.__id),n.condition={preback:"preback"},n.on("rendered",function(t){var e=t.context,i=e.saxer.get("__id")+"_OPERATE";"break"==e.saxer.get(i)&&setTimeout(function(){Progress.$width({width:"100%"}),setTimeout(function(){Progress.$opacity({opacity:"0"}),setTimeout(function(){Progress.$width({width:"0"}),setTimeout(function(){Progress.$opacity({opacity:"1"}),e.saxer.set(i,"continue")},200)},100)},100)},500)}),n.saxer.append({InstanceContext:n}),n.progress={start:function(t){"object"==(void 0===t?"undefined":_typeof(t))&&t.width&&Progress.$width(t)},end:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1e3;Progress.$width({width:"100%"}),setTimeout(function(){Progress.$opacity({opacity:"0"}),setTimeout(function(){Progress.$width({width:"0"})},300)},t)}},Popstate.on("__goback",function(t){return n.back()});return n.extend({replaceState:function(t){var e=_history[_history.length-1];e.preState?e.preState.preHref=t||window.location.href:e.preHref=t||window.location.href},getWhereInfo:function(t){var i=this.saxer.get().MenuData;return e.find(i,{path:t})},getHistory:function(t){return _history},setHistory:function(t){t&&(_history=t.history||_history,_leftStack=t.stack||_leftStack)},clearHistory:function(t){_history=[],_leftStack=[]},start:function(t,e){this.hasMounted()?this.goto(t,e,{init:!0}):this.config&&this.config.props&&(this.config.props.select=t,this.config.props.selectData=e)},delete:function(){var t=void 0;if(this.storageName&&(t=this.storageName,i.storage[t]))return i.storage.removeItem(t),!0},save:function(t,e){var o=void 0;if(t){o=t;JSON.stringify(_history),JSON.stringify(_leftStack);var r=_history[_history.length-1],a={from:window.location,history:_history,stack:_leftStack,current:r};this.storageName=o,i.storage.setItem(o,JSON.stringify(a))}},restore:function(t,e){var o=void 0;if(t&&(o=t,i.storage[o])){_restoreStat=!0;var r=JSON.parse(i.storage[o]);if(i.storage.removeItem(o),r.history.length){var a={page:r.history[r.history.length-1],stack:r.stack[r.stack.length-1]};return _history=r.history,_leftStack=r.stack,this.start(a.page.path,a.page.data),!0}}},goto:function(t,e){var i=this,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};once.call(this,function(r){setTimeout(function(){r()},__opts.gap);var a=i.emit("_beforeGoto",{record:{history:_history},param:{path:t,data:e},setHistory:i.setHistory});i.off("_beforeGoto");var n=i.emit("beforeGoto",{record:{history:_history},param:{path:t,data:e},setHistory:i.setHistory});if(!a&&!n&&"string"==typeof t){var s=i.getWhereInfo(t);s&&i.$select({select:s.index,selectData:e,direction:"goto",init:o.init,toggleUrl:o.toggleUrl})}})},back:function(t,i){var r=this;once.call(this,function(a){setTimeout(function(){a()},__opts.gap);var n=r.emit("_beforeBack",{record:{history:_history},param:{path:t,data:i},setHistory:r.setHistory});r.off("_beforeBack");var s=r.emit("beforeBack",{record:{history:_history},param:{path:t,data:i},setHistory:r.setHistory});if(!n&&!s){var c={};if(r.hasOn("preback")){var l=_history[_history.length-1],u={index:l.index,path:l.path,data:l.data,pre:l.preState,flag:l.flag};if(!(c=r.emit("preback",u)))return}if(t){if("string"!=typeof t)return;var f=r.getWhereInfo(t);f&&r.$select({select:f.index,selectData:e.merge({},i,c),direction:"jumpback"})}else{var h=r.emit("historypop");if(h)return r.$select({select:h.index,selectData:e.merge({},h.data,c),direction:"back"}),h;window.history.length?history.back():pushState({rootUrl:o},!0)}}})}}),n});
//# sourceMappingURL=maps/index.js.map
