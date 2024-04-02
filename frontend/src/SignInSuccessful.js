import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const BackToLoginButton = () => {
  const navigate = useNavigate();

  const navigateToLoginPage = () => {
    navigate("/");
  };

  return (
    <button
      className="btn btn-secondary default-container-spacing shadow"
      onClick={navigateToLoginPage}
    >
      {" "}
      Back to login page
    </button>
  );
};

export const AccountCreationSuccessful = () => {
  return (
    <>
      <div className="default-container-flexbox" style={{ minHeight: "100vh" }}>
        <div className="default-container-flexbox default-container-colour rounded">
          <h4 className="subheading default-container-spacing">
            Account created successfully!
          </h4>
          <BackToLoginButton />
        </div>
      </div>
    </>
  );
};

export const AccountAlreadyExists = () => {
  return (
    <>
      {" "}
      <div className="default-container-flexbox" style={{ minHeight: "100vh" }}>
        <div className="default-container-flexbox default-container-colour rounded">
          <h4 className="subheading default-container-spacing">
            {" "}
            Account already exists{" "}
          </h4>
          <BackToLoginButton />
        </div>
      </div>
    </>
  );
};

export const LoginFailed = () => {
  return (
    <>
      <div className="default-container-flexbox" style={{ minHeight: "100vh" }}>
        <div className="default-container-flexbox default-container-colour rounded">
          <h4 className="subheading default-container-spacing">
            Login failed{" "}
          </h4>
          <p className="text-muted standard-text default-container-spacing">
            No account exists with those credentials
          </p>
          <BackToLoginButton />
        </div>
      </div>
    </>
  );
};

export const WrongUsername = () => {
  return (
    <>
      <div className="default-container-flexbox" style={{ minHeight: "100vh" }}>
        <div className="default-container-flexbox default-container-colour rounded">
          <h4 className="subheading default-container-spacing">
            Login failed{" "}
          </h4>
          <p className="text-muted standard-text default-container-spacing">
            An account exists with that client secret but that username does not
            match{" "}
          </p>
          <BackToLoginButton />
        </div>
      </div>
    </>
  );
};
