import React from 'react'

import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  root: {
    display   : 'inline-block',
    fill      : 'currentColor',
    flexShrink: 0,
    // fontSize  : theme.typography.pxToRem(24),
    height    : '1em',
    // transition: theme.transitions.create('fill', {
    //   duration: theme.transitions.duration.shorter
    // }),
    userSelect: 'none',
    width     : '1em'
  }
})

export default function DragIcon() {
  const classes = useStyles()

  return (
    <svg className={classes.root} viewBox='0 0 24 24'>
      <path d='M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' />
    </svg>
  )
  // return (
  //   <svg style='width:24px;height:24px' viewBox='0 0 24 24'>
  //     <path d='M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' />
  //   </svg>
  // )
}
