import React, { Children, cloneElement } from 'react'
import PropTypes from 'prop-types'

import makeStyles from '@material-ui/styles/makeStyles'

import stylesNode from './tree-node-renderer-style'

const useStyles = makeStyles(stylesNode)

function FileThemeTreeNodeRenderer(props) {
  const {
    children,
    listIndex,
    swapFrom,
    swapLength,
    swapDepth,
    // scaffoldBlockPxWidth,
    lowerSiblingCounts,
    connectDropTarget,
    isOver,
    draggedNode,
    canDrop
    // treeIndex,
    // treeId, // Delete from otherProps
    // getPrevRow, // Delete from otherProps
    // node, // Delete from otherProps
    // path, // Delete from otherProps
    // rowDirection,
    // ...otherProps
  } = props

  const styles = useStyles()

  //  {...otherProps}
  return connectDropTarget(
    <div className={styles.node}>
      {
        Children.map(children, child =>
          cloneElement(child, {
            canDrop,
            draggedNode,
            isOver,
            listIndex,
            lowerSiblingCounts,
            swapDepth,
            swapFrom,
            swapLength
          })
        )
      }
    </div>
  )
}

FileThemeTreeNodeRenderer.defaultProps = {
  canDrop    : false,
  draggedNode: null,
  swapDepth  : null,
  swapFrom   : null,
  swapLength : null
}

FileThemeTreeNodeRenderer.propTypes = {
  canDrop          : PropTypes.bool,
  children         : PropTypes.node.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  draggedNode      : PropTypes.shape({}),
  getPrevRow       : PropTypes.func.isRequired,
  isOver           : PropTypes.bool.isRequired,
  listIndex        : PropTypes.number.isRequired,

  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  node              : PropTypes.shape({}).isRequired,

  // Drop target
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
  ).isRequired,
  rowDirection        : PropTypes.string.isRequired,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  swapDepth           : PropTypes.number,

  // used in dndManager
  swapFrom  : PropTypes.number,
  swapLength: PropTypes.number,
  treeId    : PropTypes.string.isRequired,
  treeIndex : PropTypes.number.isRequired
}

export default FileThemeTreeNodeRenderer
