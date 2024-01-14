import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import Login from "./login.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  AccountAlreadyExists,
  AccountCreationSuccessful,
  LoginFailed,
  WrongUsername,
} from "./SignInSuccessful";
import { accessToken, logout } from "./accessTokenManagement";
import { Homepage } from "./HomePage.js";
import { Testpage } from "./TestPage.js";

import { Provider } from "react-redux";
import store from "./redux/store";


function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  });



  return (
    <div>
      {!token ? (
        <>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/account_creation_successful"
                element={<AccountCreationSuccessful />}
              />
              <Route
                path="/account_already_exists"
                element={<AccountAlreadyExists />}
              />
              <Route path="/no_existing_account" element={<LoginFailed />} />
              <Route path="/wrong_username" element={<WrongUsername />} />
            </Routes>
          </Router>
        </>
      ) : (
        <>
          <Provider store={store}>
            <Router>
              <Routes>
                <Route path="/" element={<Homepage />} />

                <Route path="/test_page" element={<Testpage />} />
              </Routes>
            </Router>
          </Provider>
        </>
      )}
    </div>
  );
}
export default App;
