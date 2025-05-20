import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInAction,
  selectAuth,
  googleSignInAction,
  fbSignInAction,
} from "../../_store/reducers/authSlice";
import * as EmailValidator from "email-validator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useWithRouter } from "./useWithRouter";

function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authSelector = useSelector(selectAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");

  if (authSelector.authenticated) {
    return <Navigate to={"/feature"} />;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    if (email === "") {
      setMessage("Email field should not be empty");
      setIsError(true);
      return;
    }

    if (!EmailValidator.validate(email)) {
      setMessage("Invalid email");
      setIsError(true);
      return;
    }

    if (password === "") {
      setMessage("Password field should not be empty");
      setIsError(true);
      return;
    }

    try {
      dispatch(signInAction(navigate, { email, password }));
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  }

  async function handleGoogleButtonClick(e) {
    e.preventDefault();

    try {
      dispatch(googleSignInAction());
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  }

  async function handleFbButtonClick(e) {
    e.preventDefault();

    try {
      dispatch(fbSignInAction());
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  }

  function renderAlert() {
    if (authSelector.error) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {authSelector.error}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="alert alert-danger">
          <strong>Oops! </strong>
          {message}
        </div>
      );
    }
  }

  return (
    <div className="container py-5 h-100">
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <form className="text-center">
            <h3 className="mb-5">Sign in</h3>

            {/* Email Input */}
            <div className="form-floating mb-4">
              <input
                name="email"
                id="signinEmail"
                type="email"
                className="form-control form-control-lg"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label style={{ opacity: "0.5" }} htmlFor="signinEmail">
                Email
              </label>
            </div>

            {/* Password Input */}
            <div className="form-floating mb-4">
              <input
                name="password"
                id="signinPassword"
                type="password"
                className="form-control form-control-lg"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label style={{ opacity: "0.5" }} htmlFor="signinPassword">
                Password
              </label>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              {/* <!-- Checkbox --> */}
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="signinCheck"
                />
                <label className="form-check-label" htmlFor="signinCheck">
                  {" "}
                  Remember me{" "}
                </label>
              </div>
              {/* <Link to="#!">Forgot password?</Link> */}
            </div>

            {renderAlert()}

            {/* submit button */}
            <button
              className="btn btn-success btn-lg btn-block container-fluid"
              onClick={(e) => handleFormSubmit(e)}
            >
              Sign in
            </button>
          </form>

          <hr className="my-4" />
          <button
            className="btn google-button btn-lg mb-2"
            type="submit"
            onClick={(e) => handleGoogleButtonClick(e)}
          >
            <FontAwesomeIcon icon={faGoogle} /> Sign in with Google
          </button>
          <button
            className="btn fb-button btn-lg mb-2"
            type="submit"
            onClick={(e) => handleFbButtonClick(e)}
          >
            <FontAwesomeIcon icon={faFacebook} /> Sign in with Facebook
          </button>
          <br />
          <p>
            Dont have an account? Click <Link to="/signup">here</Link> to sign
            up!
          </p>
        </div>
      </div>
    </div>
  );
}

export default useWithRouter(Signin);
