import * as React from "react";
import * as ReactDOM from "react-dom"
import { store } from './store/store';
import { Provider } from 'react-redux';
import './index.css';
import {App} from "./app"

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)