import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./wdyr";
import "./i18n";
import "typeface-roboto";
import { Provider } from "react-redux";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";

import { Root } from "./Root";
import * as serviceWorker from "./serviceWorker";
import { store } from "./redux/redux";

const queryCache = new QueryCache();

const _Index = () => {
  return (
    <>
      <Provider store={store}>
        <ReactQueryCacheProvider queryCache={queryCache}>
          <BrowserRouter>
            <Root />
          </BrowserRouter>
        </ReactQueryCacheProvider>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

const Index = React.memo(_Index);

ReactDOM.render(<Index />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
