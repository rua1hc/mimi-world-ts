import React from "react";
// import ReactDOM from "react-dom";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// import { createStore } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";

import "./index.css";
import "./styles/icons/icons.css";
import "./styles/dark.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import rootReducer from "./reducers";
// const store = createStore(rootReducer, composeWithDevTools());
const store = configureStore({ reducer: rootReducer });

// ReactDOM.render(
//     <React.StrictMode>
//         <Provider store={store}>
//             <Router>
//                 <App />
//             </Router>
//         </Provider>
//     </React.StrictMode>,
//     document.getElementById("root")
// );
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
