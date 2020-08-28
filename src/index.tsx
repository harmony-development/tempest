import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./wdyr";
import "./i18n";
import "typeface-roboto";
import { Provider } from "react-redux";

import { Root } from "./Root";
import * as serviceWorker from "./serviceWorker";
import { store } from "./redux/redux";

const _Index = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </Provider>
  );
};

const Index = React.memo(_Index);

ReactDOM.render(<Index />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
