import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'antd/dist/antd.css'; // css framework
import "bootstrap/dist/css/bootstrap.min.css";

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import promisMiddleware from 'redux-promise'
import reduxThunk from 'redux-thunk'
import Reducer from './_reducers'

// middleware를 이용해야 객체의 action만 받는 store를 promise와 function도 받게 하기 위해서 추가한다.
// store는 객체만 받기 때문에, promise와 function도 받기 위해서 (promiseMiddleware, ReduxThunk) 추가한다.
const createStoreWithMiddleware = applyMiddleware(promisMiddleware, reduxThunk) (createStore)
const root = ReactDOM.createRoot(document.getElementById('root'));

//window.__REDUX_DEVTOOLS_EXTENSION__를 사용함으로써 크롬 확장 프로그램을 사용할 수 있다.
root.render(
  <React.StrictMode>
    <Provider store={createStoreWithMiddleware(Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    )} > 
      <App />
    </Provider>
  </React.StrictMode>
);
