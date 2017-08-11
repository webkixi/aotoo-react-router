# aotoo-react-treex

## Install
```bash
# install
yarn add aotoo-react-tabs
```

## USAGE  
Depends on aotoo this library, `Aotoo` is a global variable

```jsx
import aotoo from 'aotoo'
window.Aotoo = aotoo
require('aotoo-react-tabs')

const WrapElement = Aotoo.wrap( <div>这个真好吃</div>, {
  rendered: function(dom){ /* after reactDom didMounted then ... */ },
  leave: function(){ /* before reactDom will be unmounted then ..*/ }
})

const tabs = Aotoo.tabs({
  props: {
    tabClass: 'tabs-nornal-top',
    data: [
      {title: 'aaa', content: '什么, what'},
      {title: 'bbb', content: '来了'},
      {title: 'ccc', content: <WrapElement />},
    ]
  }
})

tabs.render('id')  // reader tabs to some dom with id
// cosnt xxx = tabs.render() ====> it's a jsx
```


## API  
#### $update(opts)
```jsx
// ======== or full replacement
tabs.$update({
  data: [
    {title: 'one', content: 'abcccc'},
    {title: 'two', content: 'uuuyyy'},
    ...
  ]
})
```
The above operation causes the structure to be re-rendered and the callback method `rendered` is executed again  

#### $select(index)
```jsx
tabs.$select({ select: 2 })
``` 
access the above operation, you can dynamically append the structure after you append the data(_data)  
