import React, { useState } from "react";
import "../../Styles/Sign.css";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import bg from "../../assets/bg.mp4";
import logo from "../../assets/logo.png";

const SignForm = () => {
  const [type, setType] = useState("signIn");
  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="signform">
      <video className="video-background" autoPlay loop muted>
        <source src={bg} type="video/mp4" />
      </video>
      {/* Logo */}
      <div className="logo-container">
        <img src={logo} alt="Al Nada Scientific Office" className="logo" />
        <h2>Al Nada Scientific Office</h2>
      </div>
      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                Log in to manage your tasks and stay connected with Al Nada's
                operations.
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Welcome to Al Nada!</h1>
              <p>
                Join the team to streamline your workflow and collaborate
                efficiently.
              </p>
              <button
                className="ghost "
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignForm;
