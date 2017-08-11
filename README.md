# aotoo-react-router
基于`react`库`aotoo`定制的前端路由插件，适用于前端SPA项目，可与MPA项目混合使用，默认没有带插件样式，后续会补充说明，到时再跟进

## Install
```bash
# install
yarn add aotoo-react-router
```

## Dependence npm package
1. aotoo
2. aotoo-web-widgets

## USAGE  
Depends on aotoo this library, `Aotoo` is a global variable

```jsx
import aotoo from 'aotoo'
require('aotoo-web-widgets')
require('aotoo-react-router')


// 路由配置信息
// 支持树形菜单
// title: 菜单选项
// content: 菜单对应内容，点击菜单时响应的内容
// idf: 路由配置关键key，作为节点必须配置，作为叶子可以不配置
// parent: idf的下级菜单
// attr: 参考jq的attr，会在菜单dom节点上填充 data-* 属性

const routerData = [
  {title: '我是一级', idf: 'aa1'},
  {title: '我是二级', idf: 'aa2', parent: 'aa1'},
  {title: '我是三级', idf: 'aa3', parent: 'aa2'},
  {title: '我是四级A', content: '什么3', path: 'a4', attr:{path: 'a4'}, parent: 'aa3'},
  {title: '我是四级B', content: '什sssssss么4', path: 'a5', attr:{path: 'a5'}, parent: 'aa3'},
  {title: '我是一级B', content: forLeave, path: 'a2', attr:{path: 'a2'}},
  {title: '我是一级C', content: <WrapElement />, path: 'a3', attr:{path: 'a3'}, itemClass: 'yyy'},
]

const router = Aotoo.router({
  props: {
    animate: 'fade',
    data: routerData,
    itemClass: 'nihao',
    routerClass: 'router-basic',
    itemMethod: function(dom){}
  }
})
router.start('a4')
router.rendered = function(dom){}  //必须在render之前配置，JSX mounted后运行
router.render('test')
```


## API  
#### getWhereInfo(path)
获取该路径的配置数据

#### goto(path, data)
跳转到指定页，并带一个JSON参数

#### back([path], [data])
1. 参数为可选
2. 不带参数时，回退上一步，与浏览器动作一致
3. 带参数与goto类似，但动画效果(left, right)与goto相反
4. 支持浏览器默认回退动作
