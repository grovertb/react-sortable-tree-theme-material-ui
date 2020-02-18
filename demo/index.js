import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  )
}

render(require('./app').default)

if(module.hot)
  module.hot.accept('./app', () => render(require('./app').default))
