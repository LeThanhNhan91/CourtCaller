import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, Card, CardGroup, Button } from "react-bootstrap";
import "./EditName.scss";
import { RxCross2 } from "react-icons/rx";

const EditName = () => {

  return (
    <>
      <div className="form-container">
        <div class="edit-container">
          <h2 className="edit-header">Update Information</h2>
          <div class="form-box">
            <div class="form-edit-group">
              <div class="account">
                <h3>Account</h3>
                <p>halinhtvn3a</p>
              </div>
              <div className="form-edit">
                <div className="edit-left">
                  <div class="form-field">
                    <span>Full Name</span>
                    <input className="input-fname" type="text" id="name" />
                  </div>
                  <div class="form-field">
                    <span>Phone</span>
                    <input className="input-phone" type="text" id="phone" />
                  </div>
                </div>
                <div className="edit-right">
                  <div class="form-field">
                    <span>Email</span>
                    <input
                      className="input-email"
                      type="email"
                      id="email"
                      value="duonghaingu@gmail.com"
                    />
                  </div>
                  <div class="form-field">
                    <span>Facebook</span>
                    <input className="input-fb" type="text" id="facebook" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="buttons-edit">
            <Link to="/profile">
              <button class="btn-back">Cancel</button>
            </Link>
            <button class="btn-update">Update</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditName;
