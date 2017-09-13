"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function pushState(t,e){var a=t.flag?"boolean"==typeof t.flag?"#":t.flag:"",n=a?t.rootUrl+a+t.key:t.rootUrl;window.history.pushState(t,"",n)}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_createClass=function(){function t(t,e){for(var a=0;a<e.length;a++){var n=e[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,a,n){return a&&t(e.prototype,a),n&&t(e,n),e}}(),_get=function t(e,a,n){null===e&&(e=Function.prototype);var o=Object.getOwnPropertyDescriptor(e,a);if(void 0===o){var i=Object.getPrototypeOf(e);return null===i?void 0:t(i,a,n)}if("value"in o)return o.value;var r=o.get;if(void 0!==r)return r.call(n)},_aotooReactTabs=require("aotoo-react-tabs");require("aotoo-mixins-iscroll");var Popstate=SAX("Popstate");!function(){var t="complete"!=document.readyState;window.addEventListener("load",function(){setTimeout(function(){t=!1},0)},!1),window.addEventListener("popstate",function(e){t&&"complete"==document.readyState?(e.preventDefault(),e.stopImmediatePropagation()):Popstate.emit("goback")},!1)}();var _history=[],_historyCount=0,_leftStack=[],animatecss={fade:{in:" fadeIn animated-faster",rein:" fadeIn animated-fastest",out:" fadeOut contentHide animated-fastest",back:" fadeOut contentHide animated-faster"},left:{in:" fadeInLeft animated-faster",rein:" fadeIn animated-fastest",out:" fadeOut contentHide animated-fastest",back:" fadeOutLeft contentHide animated-faster"},right:{in:" fadeInRight animated-faster",rein:" fadeIn animated-fastest",out:" outHeight fadeOut contentHide animated-fastest",back:" outHeight fadeOutRight contentHide animated-faster"}};Aotoo.extend("router",function(t,e){var a={props:{routerClass:"routerGroup",mulitple:!1}};t=e.merge(a,t);var n=location.href.split("#")[0],o=function(t){function a(t){_classCallCheck(this,a);var o=_possibleConstructorReturn(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,t));if(o.state=e.merge(o.state,{flag:!0,rootUrl:o.props.rootUrl||n,direction:"goto",animate:o.props.animate||"right"}),o.prePageInfo,o.state.animate){var i=o.state.animate;o.animatein=animatecss[i].in,o.animaterein=animatecss[i].rein,o.animateout=animatecss[i].out,o.animateback=animatecss[i].back}return o.historyPush=o.historyPush.bind(o),o.getRealContent=o.getRealContent.bind(o),o.findPath=o.findPath.bind(o),o}return _inherits(a,_aotooReactTabs.Tabs),_createClass(a,[{key:"componentWillMount",value:function(){_get(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),"componentWillMount",this).call(this);var t=this,e=this.saxer.get().MenuData;this.saxer.get().ContentData,e[this.state.select];this.on("historypush",function(e){var a=e.path,n=e.data,o=t.findPath(a);t.historyPush({index:o.index,key:o.path,data:n||{}})}),this.on("historypop",function(e){return t.historyPop(e)}),this.emit("historypush",{path:this.state.select,data:{}})}},{key:"findPath",value:function(t){var a=void 0===t?"undefined":_typeof(t),n=this.saxer.get().MenuData;return"number"==a?n[t]:"string"==a?e.find(n,{path:t}):void 0}},{key:"historyPush",value:function(t){if(this.state.flag){var e=window.history.state;pushState({index:t.index,key:t.key,data:t.data,rootUrl:this.state.rootUrl,preState:e,timeLine:_historyCount,flag:this.state.flag})}else pushState({rootUrl:this.state.rootUrl,flag:this.state.flag},!0);var a=_history[_history.length-1];_history.push({index:t.index,key:t.key,data:t.data,preState:a,timeLine:_historyCount}),_historyCount++}},{key:"historyPop",value:function(){var t=_history.pop();if(!t)return!1;var e=void 0;return this.state.flag?(e=t&&t.preState)&&pushState({index:e.index,key:e.key,data:e.data,rootUrl:this.state.rootUrl,preState:"curHistoryState",flag:this.state.flag}):(e=_history.pop(),pushState({rootUrl:this.state.rootUrl,flag:this.state.flag},!0)),e}},{key:"getRealContent",value:function(t){if(!t)return" ";var e=this.saxer.get().InstanceContext,a=this.state.selectData;if("function"==typeof t){var n=t(e);if("object"==(void 0===n?"undefined":_typeof(n))){if(n.$$typeof)return n;if("function"==typeof n.enter)return n.enter(a);if("function"==typeof n.main)return n.main(a)}}return t}},{key:"getPage",value:function(t){var a=this.state.select,n=this.animatein,o=this.animateout,i=void 0,r=void 0,s=void 0;"back"==this.state.direction?(o=this.animateback,n=this.animaterein,i=_leftStack.pop()):i=_leftStack.length?_leftStack[_leftStack.length-1]:"","fade"!==this.state.animate?i&&i.id!==a&&(this.prePageInfo=i,s=this.getRealContent(this.getContent(i.id)),r=React.createElement("div",{key:e.uniqueId("Router_Single_"),className:t+o},s)):r=React.createElement("div",{key:e.uniqueId("Router_Single_"),className:t+o});var u=this.getContent(a),c=this.getRealContent(u),f=React.createElement("div",{key:e.uniqueId("Router_Single_"),className:t+n},c);return _leftStack.push({id:a,content:c,origin:u}),[r,f]}},{key:"leaveContent",value:function(){if(this.prePageInfo){var t=this.saxer.get().InstanceContext,e=this.prePageInfo.origin;if("function"==typeof e){var a=e(t);if("object"==(void 0===a?"undefined":_typeof(a))&&"function"==typeof a.leave)return a.leave()}}}},{key:"componentDidMount",value:function(){this.leaveContent()}},{key:"componentDidUpdate",value:function(t,e){this.leaveContent()}},{key:"render",value:function(){var t=this.props.routerClass?"routerGroup "+this.props.routerClass:"routerGroup ",e=this.props.mulitple?"routerBoxes mulitple":"routerBoxes",a=this.saxer.get().MenuJsx,n=this.getPage(e),o=Aotoo.iscroll(React.createElement("div",{className:"routerMenus"},a),{onscroll:function(){},onscrollend:function(){}});return React.createElement("div",{className:t},this.state.showMenu?React.createElement(o,null):"",n)}}]),a}(),i={UPDATE:function(t,e,a){var n=this.curState;return n.data=e.data,n},SELECT:function(t,e,a){var n=this.curState;return n.select=e.select,e.data&&(n.selectData=e.data),e.direction&&(n.direction=e.direction||"goto"),"goto"==n.direction&&a.emit("historypush",{path:n.select,data:n.selectData}),"function"==typeof e.cb&&setTimeout(function(){e.cb()},100),n}},r=Aotoo(o,i,a);return r.saxer.append({InstanceContext:r}),Popstate.on("goback",function(){return r.back()}),r.extend({getWhereInfo:function(t){var a=this.saxer.get().MenuData;return e.find(a,{path:t})},start:function(t,e){this.hasMounted()?this.goto(t,e):this.config&&this.config.props&&(this.config.props.select=t,this.config.props.selectData=e)},goto:function(t,e){if("string"==typeof t){var a=this.getWhereInfo(t);this.$select({select:a.index,selectData:e,direction:"goto"})}},back:function(t,e){if(t){if("string"!=typeof t)return;var a=this.getWhereInfo(t);this.$select({select:a.index,selectData:e,direction:"back"})}else{var o=this.emit("historypop");if(o)return this.$select({select:o.index,selectData:o.data,direction:"back"}),o;pushState({rootUrl:n},!0)}}}),r});
//# sourceMappingURL=maps/index.js.map
