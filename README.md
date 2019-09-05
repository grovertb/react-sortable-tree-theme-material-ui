# React Sortable Tree Material-UI Theme

![theme appearance](https://user-images.githubusercontent.com/4413963/32144463-a7de23e0-bcfc-11e7-8054-1a83d561261e.png)

## Features

- You can click anywhere on a node to drag it.
- More compact design, with indentation alone used to represent tree depth.

## Usage

```sh
npm install --save react-sortable-tree-theme-material-ui
```

```jsx
import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import MaterialTheme from 'react-sortable-tree-theme-material-ui';

export default class Tree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [ { children: [ { title: 'Box' } ], expanded: true, title: 'Layout' } ]
    };
  }

  render() {
    return (
      <div style={{ height: 400, overflowX: 'hidden', overflowY: 'auto' }}>
        <SortableTree
          generateNodeProps={
            rowInfo => ({
              buttons: (
                <i className='material-icons' style={{ fontSize: 18 }}>
                  more_vert
                </i>
              ),
              icons: (
                <i className='material-icons' style={{ fontSize: 18 }}>
                  drag_indicator
                </i>
              ),
              title: (
                <Fragment>
                  <i className='material-icons' style={{ color: '#1890FF', fontSize: 18, marginRight: 6 }}>link</i>
                  <span>{rowInfo.node.title}</span>
                </Fragment>
              )
            })
          }
          isVirtualized={false}
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
          theme={MaterialTheme}
        />
      </div>
    );
  }
}
```
