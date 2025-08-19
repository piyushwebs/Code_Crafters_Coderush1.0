import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



export default function NavBar() {
  return (
    <>
      <nav className="navbar navbar-light navbar-expand-lg " style={{backgroundColor:"rgb(207, 241, 229)", margin:"10px"}}>
      <a className="navbar-brand" href="/HomePage">
       <h3> Logo </h3>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="/">
              Home <span className="sr-only">(current)</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/Login">
              Login
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/Signup">
              Signup
            </a>
          </li>
        </ul>
      </div>
    </nav>
    </>
  );
}
