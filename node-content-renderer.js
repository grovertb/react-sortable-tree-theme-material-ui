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
    connectDragPreview,
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
    swapDepth
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
    // if(i > 0) {
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
    // }
  })

  const nodeContent = (
    <div className={styles.nodeContent}>
      {/* {
        toggleChildrenVisibility &&
        node.children &&
        node.children.length > 0 && (
          <button
            type="button"
            aria-label={node.expanded ? 'Collapse' : 'Expand'}
            className={
              node.expanded ? styles.collapseButton : styles.expandButton
            }
            style={{
              left: (lowerSiblingCounts.length - 0.7) * scaffoldBlockPxWidth,
            }}
            onClick={() =>
              toggleChildrenVisibility({
                node,
                path,
                treeIndex,
              })
            }
          />
        )
      } */}

      <div className={styles.rowWrapper + (!canDrag ? ` ${styles.rowWrapperDragDisabled}` : '')}>
        {scaffold}
        {
          connectDragPreview(
            <div
              className={
                styles.row +
                (isLandingPadActive ? ` ${styles.rowLandingPad}` : '') +
                (isLandingPadActive && !canDrop ? ` ${styles.rowCancelPad}` : '') +
                (isSearchMatch ? ` ${styles.rowSearchMatch}` : '') +
                (isSearchFocus ? ` ${styles.rowSearchFocus}` : '') +
                (className ? ` ${className}` : '')
              }
              style={{
                opacity: isDraggedDescendant ? 0.5 : 1,
                // paddingLeft: scaffoldBlockPxWidth,
                ...style
              }}>
              <div className={styles.rowContents + (!canDrag ? ` ${styles.rowContentsDragDisabled}` : '')}>
                <div className={styles.rowIcon}>
                  {icons.map((icon, index) => (
                    <Fragment key={index} >
                      {icon}
                    </Fragment>
                  ))}
                </div>
                <div className={styles.rowLabel}>
                  {
                    typeof nodeTitle === 'string' ?
                      <span className={styles.rowTitle}>{nodeTitle}</span> :
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
                  {
                    buttons.map((btn, index) => (
                      <Fragment key={index} >
                        {btn}
                      </Fragment>
                    ))
                  }
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )

  return canDrag ?
    connectDragSource(nodeContent, { dropEffect: 'copy' }) :
    nodeContent
}

FileThemeNodeContentRenderer.defaultProps = {
  buttons                 : [],
  canDrag                 : false,
  canDrop                 : false,
  className               : '',
  draggedNode             : null,
  icons                   : [],
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
  buttons           : PropTypes.arrayOf(PropTypes.node),
  canDrag           : PropTypes.bool,
  canDrop           : PropTypes.bool,
  className         : PropTypes.string,
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource : PropTypes.func.isRequired,
  didDrop           : PropTypes.bool.isRequired,
  draggedNode       : PropTypes.shape({}),
  icons             : PropTypes.arrayOf(PropTypes.node),
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
