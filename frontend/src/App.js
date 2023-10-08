import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Login from "./login.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AccountAlreadyExists, AccountCreationSuccessful} from './SignInSuccessful'

function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/account_creation_successful" element={<AccountCreationSuccessful />} />
          <Route path="/account_already_exists" element={<AccountAlreadyExists />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
