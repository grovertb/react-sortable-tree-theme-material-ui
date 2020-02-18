import React from 'react'
import SortableTree, { toggleExpandedForAll } from 'react-sortable-tree'
import { makeStyles } from '@material-ui/styles'
import MaterialUITheme from '../index'

const useStyles = makeStyles({
  '@global': {
    body: {
      margin : 0,
      padding: 0
    }
  },
  form: {
    display   : 'inline-flex',
    marginLeft: 8
  },
  root: {
    display      : 'flex',
    flexDirection: 'column',
    height       : '100vh',
    padding      : '0 15px'
  }
})

function App() {
  const [ searchFocusIndex, setSearchFocusIndex ] = React.useState(0)
  const [ searchFoundCount, setSearchFoundCount ] = React.useState(null)
  const [ searchString, setSearchString ] = React.useState('')
  const [ treeData, setTreeData ] = React.useState([
    {
      children: [
        { title: 'styles.css' }
      ],
      expanded   : true,
      isDirectory: true,
      title      : 'src'
    },
    { title: 'index.js' },
    { title: 'reducers.js' },
    { title: 'actions.js' },
    { title: 'utils.js' },
    { title: '.gitignore' },
    { title: 'package.json' },
    {
      children: [
        { title: '12214124-log' },
        { dragDisabled: true, title: 'drag-disabled-file' }
      ],
      isDirectory: true,
      title      : 'tmp'
    },
    {
      children   : [ { title: 'react-sortable-tree.js' } ],
      isDirectory: true,
      title      : 'build'
    },
    {
      isDirectory: true,
      title      : 'public'
    },
    {
      isDirectory: true,
      title      : 'node_modules'
    },
    {
      title: 'file.txt'
    }
  ])

  const classes = useStyles()

  const _handleUpdateTreeData = treeData => {
    setTreeData(treeData)
  }

  const expand = expanded => {
    setTreeData(
      toggleExpandedForAll({
        expanded,
        treeData
      })
    )
  }

  const _handleExpandAll = () => {
    expand(true)
  }

  const _handleCollapseAll = () => {
    expand(false)
  }

  const alertNodeInfo = ({ node, path, treeIndex }) => {
    const objectString = Object.keys(node)
      .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
      .join(',\n   ')

    global.alert(
      'Info passed to the icon and button generators:\n\n' +
          `node: {\n   ${objectString}\n},\n` +
          `path: [${path.join(', ')}],\n` +
          `treeIndex: ${treeIndex}`
    )
  }

  const selectPrevMatch = () => {
    setSearchFocusIndex(
      searchFocusIndex !== null ?
        (searchFoundCount + searchFocusIndex - 1) % searchFoundCount :
        searchFoundCount - 1
    )
  }

  const selectNextMatch = () => {
    setSearchFocusIndex(
      searchFocusIndex !== null ?
        (searchFocusIndex + 1) % searchFoundCount :
        0
    )
  }

  return (
    <div className={classes.root}>
      <div>
        <h3>File Explorer Theme</h3>
        <button onClick={_handleExpandAll}>Expand All</button>
        <button onClick={_handleCollapseAll}>Collapse All</button>
        <form className={classes.form} onSubmit={ev => ev.preventDefault()}>
          <label htmlFor='find-box'>
              Search:&nbsp;
            <input
              id='find-box'
              onChange={ev => {
                setSearchString(ev.target.value)
              }}
              type='text'
              value={searchString} />
          </label>

          <button
            disabled={!searchFoundCount}
            onClick={selectPrevMatch}
            type='button'>
              &lt;
          </button>

          <button
            disabled={!searchFoundCount}
            onClick={selectNextMatch}
            type='submit'>
              &gt;
          </button>

          <span>
              &nbsp;
            {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              &nbsp;/&nbsp;
            {searchFoundCount || 0}
          </span>
        </form>
      </div>

      <div>
        <SortableTree
          canDrag={({ node }) => !node.dragDisabled}
          canDrop={({ nextParent }) => !nextParent || nextParent.isDirectory}
          generateNodeProps={rowInfo => ({
            buttons: [
              <button
                key={`row-${1 + rowInfo.treeIndex}`}
                onClick={() => alertNodeInfo(rowInfo)}
                style={{
                  backgroundColor: 'gray',
                  border         : 0,
                  borderRadius   : '100%',
                  color          : 'white',
                  fontWeight     : 100,
                  height         : 16,
                  padding        : 0,
                  width          : 16
                }}>
                  i
              </button>
            ],
            icons: rowInfo.node.isDirectory ?
              [
                <div
                  key={`row-${1 + rowInfo.treeIndex}`}
                  style={{
                    borderBottom: 'solid 10px gray',
                    borderColor : rowInfo.node.expanded ? 'white' : 'gray',
                    borderLeft  : 'solid 8px gray',
                    boxSizing   : 'border-box',
                    filter      : rowInfo.node.expanded ?
                      'drop-shadow(1px 0 0 gray) drop-shadow(0 1px 0 gray) drop-shadow(0 -1px 0 gray) drop-shadow(-1px 0 0 gray)' :
                      'none',
                    height     : 12,
                    marginRight: 10,
                    width      : 16
                  }} />
              ] :
              [
                <div
                  key={`row-${1 + rowInfo.treeIndex}`}
                  style={{
                    border     : 'solid 1px black',
                    fontSize   : 8,
                    height     : 16,
                    marginRight: 10,
                    textAlign  : 'center',
                    width      : 12
                  }}>
                    F
                </div>
              ]
          })}
          isVirtualized={false}
          onChange={_handleUpdateTreeData}
          searchFinishCallback={matches => {
            if(matches.length) {
              setSearchFoundCount(matches.length)
              setSearchFocusIndex(matches.length > 0 ? searchFocusIndex % matches.length : 0)
            }
          }}
          searchFocusOffset={searchFocusIndex}
          searchQuery={searchString}
          theme={MaterialUITheme}
          treeData={treeData} />
      </div>
    </div>
  )
}

export default App
