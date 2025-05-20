/* Settings.js
 *  Component that shows allows user to change name, email, or password
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  changeNameAction,
  changeEmailAction,
  changePasswordAction,
  deleteAccountAction,
  changeEmailAlert,
  selectAuth,
} from "../../_store/reducers/authSlice";
import * as EmailValidator from "email-validator";

const Settings = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectAuth).userProfile;
  const authSelector = useSelector(selectAuth);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newEmailpw, setNewEmailpw] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [dPassword, setDPassword] = useState("");
  const [newNameAlert, setNewNameAlert] = useState("");
  const [newEmailAlert, setNewEmailAlert] = useState("");
  const [newPasswordAlert, setNewPasswordAlert] = useState("");
  const [deleteAccountAlert, setDeleteAccountAlert] = useState("");
  const [daForm, setDAform] = useState(false);

  useEffect(() => {
    if (profile.email === "") {
      dispatch(getProfile());
    }
  }, [dispatch]);

  async function handleNameChangeButton(e) {
    e.preventDefault();

    if (newName === "") {
      setNewNameAlert("Name cannot be empty");
      return;
    }

    if (newName === profile.name) {
      setNewNameAlert("Thats the same name");
      return;
    }

    try {
      dispatch(changeNameAction(newName));
      setNewName("");
    } catch (err) {
      console.log(err);
      setNewNameAlert("Something went wrong, please try again later");
    }
  }

  async function handleEmailChangeButton(e) {
    e.preventDefault();
    setNewEmailAlert("");
    dispatch(changeEmailAlert(""));

    if (newEmail === profile.email) {
      setNewEmailAlert("That's the same email");
      return;
    }

    if (!EmailValidator.validate(newEmail)) {
      setNewEmailAlert("Invalid email");
      return;
    }

    if (newEmailpw === "") {
      setNewEmailAlert("Password field cannot be empty");
      return;
    }

    try {
      dispatch(changeEmailAction(newEmail, newEmailpw));
      setNewEmail("");
      setNewEmailpw("");
    } catch (err) {
      console.log(err);
      setNewEmailAlert("Something went wrong, please try again later");
    }
  }

  async function handlePasswordChangeButton(e) {
    e.preventDefault();
    setNewPasswordAlert("");

    if (oldPassword === "") {
      setNewPasswordAlert("Old Password field empty");
      return;
    }

    if (newPassword1 === "") {
      setNewPasswordAlert("New Password field empty");
      return;
    }

    if (newPassword1.length < 6) {
      setNewPasswordAlert("Password should be at least 6 characters");
      return;
    }

    if (newPassword1 !== newPassword2) {
      setNewPasswordAlert("Passwords do not match");
      return;
    }

    try {
      dispatch(changePasswordAction(oldPassword, newPassword1));
      setDPassword("");
      setNewPassword1("");
      setNewPassword2("");
    } catch (err) {
      console.log(err);
      setNewPasswordAlert("Something went wrong please try again later");
    }
  }

  async function handleDeleteAccountButton(e) {
    e.preventDefault();
    setDeleteAccountAlert("");

    if (dPassword === "") {
      setDeleteAccountAlert("Password field empty");
      return;
    }

    try {
      dispatch(deleteAccountAction(dPassword));
      setDPassword("");
    } catch (err) {
      console.log(err);
      setDeleteAccountAlert("Something went wrong please try again later");
    }
  }

  function renderEmailAlert() {
    if (authSelector.emailAlert) {
      return (
        <div className="alert alert-danger">
          <strong>Oops! </strong>
          {authSelector.emailAlert}
        </div>
      );
    }

    if (newEmailAlert !== "") {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {newEmailAlert}
        </div>
      );
    }
  }

  function renderPasswordAlert() {
    if (authSelector.pwAlert) {
      return <div className="alert alert-danger">{authSelector.pwAlert}</div>;
    }

    if (newPasswordAlert !== "") {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {newPasswordAlert}
        </div>
      );
    }
  }

  function renderDAform() {
    if (daForm) {
      return (
        <>
          <div className="alert alert-danger">
            WARNING: This action cannot be reversed. If you are sure you want to
            delete your account, confirm your password and continue. Otherwise
            click cancel.
          </div>
          <div className="form-floating mb-4">
            <input
              name="dPassword"
              id="dPassword"
              type="password"
              className="form-control form-control-lg"
              placeholder="Confirm password"
              value={dPassword}
              onChange={(e) => setDPassword(e.target.value)}
              required
            />
            <label style={{ opacity: "0.5" }} htmlFor="dPassword">
              Confirm password
            </label>
          </div>
          <button
            className="btn btn-danger btn-md btn-block"
            style={{ marginRight: "5px" }}
            onClick={(e) => {
              e.preventDefault();
              setDAform(false);
            }}
          >
            CANCEL
          </button>
          <button
            className="btn btn-secondary btn-md btn-block"
            onClick={(e) => handleDeleteAccountButton(e)}
          >
            Continue to Delete account
          </button>
        </>
      );
    } else {
      return (
        <button
          className="btn btn-danger btn-md btn-block"
          onClick={(e) => {
            e.preventDefault();
            setDAform(true);
          }}
        >
          Delete account
        </button>
      );
    }
  }

  function renderDeleteAlert() {
    if (authSelector.daAlert) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {authSelector.daAlert}
        </div>
      );
    }

    if (deleteAccountAlert) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {deleteAccountAlert}
        </div>
      );
    }
  }

  return (
    <div className="container h-100">
      <h2>User Settings</h2>
      <br />
      <h5>Change Name</h5>
      <p>
        Your name: <b>{profile.name}</b>{" "}
      </p>
      <div className="form-floating mb-4">
        <input
          name="changeName"
          id="changeName"
          type="text"
          className="form-control form-control-lg"
          placeholder="name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <label style={{ opacity: "0.5" }} htmlFor="changeName">
          Change Name
        </label>
      </div>
      <button
        className="btn btn-secondary btn-md btn-block"
        onClick={(e) => handleNameChangeButton(e)}
      >
        Submit name change
      </button>
      {newNameAlert === "" ? <br /> : <p>{newNameAlert}</p>}
      <br />
      <h5>Change Email</h5>
      <p>
        Your email: <b>{profile.email}</b>
      </p>
      <div className="form-floating mb-4">
        <input
          name="changeEmail"
          id="changeEmail"
          type="email"
          className="form-control form-control-lg"
          placeholder="name@example.com"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
        />
        <label style={{ opacity: "0.5" }} htmlFor="changeEmail">
          New Email
        </label>
      </div>
      <div className="form-floating mb-4">
        <input
          name="confirmPassword"
          id="confirmPassword"
          type="password"
          className="form-control form-control-lg"
          placeholder="Confirm password"
          value={newEmailpw}
          onChange={(e) => setNewEmailpw(e.target.value)}
          required
        />
        <label style={{ opacity: "0.5" }} htmlFor="confirmPassword">
          Password
        </label>
      </div>
      <button
        className="btn btn-secondary btn-md btn-block"
        onClick={(e) => handleEmailChangeButton(e)}
      >
        Submit email change
      </button>
      {renderEmailAlert()}
      <br />
      <br />
      <h5>Change password </h5>
      <div className="form-floating mb-4">
        <input
          name="changePassword0"
          id="changePassword0"
          type="password"
          className="form-control form-control-lg"
          placeholder="Old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <label style={{ opacity: "0.5" }} htmlFor="changePassword0">
          Old password
        </label>
      </div>
      <div className="form-floating mb-4">
        <input
          name="changePassword1"
          id="changePassword1"
          type="password"
          className="form-control form-control-lg"
          placeholder="change password"
          value={newPassword1}
          onChange={(e) => setNewPassword1(e.target.value)}
          required
        />
        <label style={{ opacity: "0.5" }} htmlFor="changePassword1">
          New password
        </label>
      </div>
      <div className="form-floating mb-4">
        <input
          name="changePassword2"
          id="changePassword2"
          type="password"
          className="form-control form-control-lg"
          placeholder="retype password"
          value={newPassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
          required
        />
        <label style={{ opacity: "0.5" }} htmlFor="changePassword2">
          Confirm new password
        </label>
      </div>
      <button
        className="btn btn-secondary btn-md btn-block"
        onClick={(e) => handlePasswordChangeButton(e)}
      >
        Submit password change
      </button>
      {renderPasswordAlert()}

      <hr />

      <h5>Danger zone</h5>

      {renderDAform()}
      {renderDeleteAlert()}
    </div>
  );
};

export default Settings;
