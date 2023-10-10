import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export const AccountCreationSuccessful = () => {

    const navigate = useNavigate();

    const navigateToLoginPage = () => {
        navigate("/");
      };

  return (
    <>
     <div>Account created successfully!</div>;
     <button onClick={navigateToLoginPage}> To Login page</button>
    </>
  )
};

export const AccountAlreadyExists = () => {

    const navigate = useNavigate();

    const navigateToLoginPage = () => {
        navigate("/");
      };

  return (
    <>
     <div>Account already exists</div>;
     <button onClick={navigateToLoginPage}> To Login page</button>
    </>
  )
};

export const LoginFailed = () => {

  const navigate = useNavigate();

  const navigateToLoginPage = () => {
      navigate("/");
    };

return (
  <>
   <div>Login failed - no account exists with those credentials </div>;
   <button onClick={navigateToLoginPage}> To Login page</button>
  </>
)
};

export const WrongUsername= () => {

  const navigate = useNavigate();

  const navigateToLoginPage = () => {
      navigate("/");
    };

return (
  <>
   <div>Login failed - account exists with that client secret but that username does not match </div>;
   <button onClick={navigateToLoginPage}> To Login page</button>
  </>
)
};

