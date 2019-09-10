import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import makeStyles from '@material-ui/styles/makeStyles'
import stylesNode from './node-content-renderer-style.js'

const useStyles = makeStyles(stylesNode)

function isDescendant(older, younger) {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(
      child => child === younger || isDescendant(child, younger)
    )
  )
}

function FileThemeNodeContentRenderer(props) {
  const {
    scaffoldBlockPxWidth,
    // toggleChildrenVisibility,
    // connectDragPreview,
    connectDragSource,
    isDragging,
    canDrop,
    canDrag,
    node,
    title,
    draggedNode,
    path,
    treeIndex,
    isSearchMatch,
    isSearchFocus,
    icons,
    buttons,
    className,
    style,
    didDrop,
    lowerSiblingCounts,
    listIndex,
    swapFrom,
    swapLength,
    swapDepth,
    onItemClick
    // treeId, // Not needed, but preserved for other renderers
    // isOver, // Not needed, but preserved for other renderers
    // parentNode, // Needed for dndManager
    // rowDirection
  } = props

  const styles = useStyles()

  const nodeTitle = title || node.title

  const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
  const isLandingPadActive = !didDrop && isDragging

  // Construct the scaffold representing the structure of the tree
  const scaffold = []

  lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
    if(i > 0) {
      scaffold.push(
        <div
          className={styles.lineBlock}
          key={`pre_${1 + i}`}
          style={{ width: scaffoldBlockPxWidth }} />
      )

      if(treeIndex !== listIndex && i === swapDepth) {
      // This row has been shifted, and is at the depth of
      // the line pointing to the new destination
        let highlightLineClass = ''

        if(listIndex === swapFrom + swapLength - 1)
        // This block is on the bottom (target) line
        // This block points at the target block (where the row will go when released)
          highlightLineClass = styles.highlightBottomLeftCorner
        else if(treeIndex === swapFrom)
        // This block is on the top (source) line
          highlightLineClass = styles.highlightTopLeftCorner
        else
        // This block is between the bottom and top
          highlightLineClass = styles.highlightLineVertical

        scaffold.push(
          <div
            className={`${styles.absoluteLineBlock} ${highlightLineClass}`}
            key={`highlight_${1 + i}`}
            style={{
              left : scaffoldBlockPxWidth * i,
              width: scaffoldBlockPxWidth
            }} />
        )
      }
    }
  })

  const nodeContent = (
    <Fragment>
      {scaffold}
      {
        // connectDragPreview
        connectDragSource(
          <div
            className={
              styles.row +
              (node.active ? ` ${styles.activeRow}` : '') +
              (isLandingPadActive ? ` ${styles.rowLandingPad}` : '') +
              (isDragging ? ` ${styles.rowLandingPadDisable}` : '') +
              (isLandingPadActive && !canDrop ? ` ${styles.rowCancelPad}` : '') +
              (isSearchMatch ? ` ${styles.rowSearchMatch}` : '') +
              (isSearchFocus ? ` ${styles.rowSearchFocus}` : '') +
              (!canDrag ? ` ${styles.rowWrapperDragDisabled}` : '') +
              (className ? ` ${className}` : '')
            }
            onClick={() => onItemClick ? onItemClick({ ...node, index: treeIndex }) : null}
            style={{
              opacity: isDraggedDescendant ? 0.5 : 1,
              ...style
            }}>
            <div className={styles.rowIcon}>
              {icons}
            </div>
            <div className={styles.rowLabel}>
              {
                typeof nodeTitle === 'string' ?
                  <span className={styles.rowTitle}>{nodeTitle}</span>  :
                  typeof nodeTitle === 'function' ?
                    nodeTitle({
                      node,
                      path,
                      treeIndex
                    }) :
                    nodeTitle
              }
            </div>
            <div className={styles.rowToolbar}>
              {buttons}
            </div>
          </div>
        )
      }
    </Fragment>
  )

  // return canDrag ?
  //   connectDragSource(nodeContent, { dropEffect: 'copy' }) :
  //   nodeContent

  return nodeContent
}

FileThemeNodeContentRenderer.defaultProps = {
  buttons                 : null,
  canDrag                 : false,
  canDrop                 : false,
  className               : '',
  draggedNode             : null,
  icons                   : null,
  isSearchFocus           : false,
  isSearchMatch           : false,
  parentNode              : null,
  style                   : {},
  swapDepth               : null,
  swapFrom                : null,
  swapLength              : null,
  title                   : null,
  toggleChildrenVisibility: null
}

FileThemeNodeContentRenderer.propTypes = {
  buttons           : PropTypes.node,
  canDrag           : PropTypes.bool,
  canDrop           : PropTypes.bool,
  className         : PropTypes.string,
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource : PropTypes.func.isRequired,
  didDrop           : PropTypes.bool.isRequired,
  draggedNode       : PropTypes.shape({}),
  icons             : PropTypes.node,
  isDragging        : PropTypes.bool.isRequired,
  isOver            : PropTypes.bool.isRequired,
  isSearchFocus     : PropTypes.bool,
  isSearchMatch     : PropTypes.bool,
  listIndex         : PropTypes.number.isRequired,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  node              : PropTypes.shape({}).isRequired,
  parentNode        : PropTypes.shape({}),
  path              : PropTypes.arrayOf(
    PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
  ).isRequired,
  rowDirection        : PropTypes.string.isRequired,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,

  // Drag and drop API functions
  // Drag source
  style                   : PropTypes.shape({}),
  swapDepth               : PropTypes.number,
  swapFrom                : PropTypes.number,
  swapLength              : PropTypes.number,
  title                   : PropTypes.oneOfType([ PropTypes.func, PropTypes.node ]),
  toggleChildrenVisibility: PropTypes.func, // Needed for dndManager
  // Drop target
  treeId                  : PropTypes.string.isRequired,
  treeIndex               : PropTypes.number.isRequired
}

export default FileThemeNodeContentRenderer
