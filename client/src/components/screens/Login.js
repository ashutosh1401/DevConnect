import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";

const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid Email", classes: "#e53935 red darken-1" });
      return;
    }
    if (password.length <= 6) {
      M.toast({
        html: "Password must be larger than 6 char",
        classes: "#e53935 red darken-1",
      });
      return;
    }
    fetch("/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "Signed in Successfully",
            classes: "#76ff03 light-green accent-3",
          });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className="login-card">
        <div className="card auth-card input-field">
          <h2>DevConnect</h2>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn waves-effect waves-light #039be5 light-blue darken-1"
            onClick={() => PostData()}
          >
            Login
          </button>
          <h5>
            <Link to="/signup">Don't have an account ?</Link>
          </h5>
          <h6>
            <Link to="/reset">Forgot Password</Link>
          </h6>
        </div>
      </div>
      <div className="container">
        <div className="col s12 m12 l12">
          <p className="info-login">
            Demo <b>UserName: abcd@gmail.com </b>
          </p>
          <p className="info-login">
            <b>Password: 1234567</b>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
