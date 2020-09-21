import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("")
  const [url, setUrl] = useState(undefined)
  const [github, setGithub] = useState("")
  const [linkedin, setLinkedin] = useState("")

  useEffect(() => {
    if (url) {
      uploadFields()
    }
  })

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "DevConnect");
    data.append("cloud_name", "devimg");

    // fetching data from node API

    fetch("https://api.cloudinary.com/v1_1/devimg/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  }

  const uploadFields = () => {
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
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        github,
        linkedin,
        pic: url
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
          M.toast({
            html: data.message,
            classes: "#76ff03 light-green accent-3",
          });
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const PostData = () => {
    if (image) {
      uploadPic()
    }
    else {
      uploadFields()
    }

  };

  return (
    <div className="login-card">
      <div className="card auth-card input-field">
        <h2>DevConnect</h2>
        <input
          type="text"
          placeholder="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
        <input
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>Upload Pic</span>
            <input
              type="file"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <div className="file-field input-field">
          <i className="fab fa-github prefix"></i>
          <input type="url"
            className="file-path validate"
            placeholder="Github Link"
            onChange={(e) => {
              setGithub(e.target.value)
            }}
            value={github} />
        </div>
        <div className="file-field input-field">
          <i className="fab fa-linkedin prefix"></i>
          <input type="url"
            className="file-path validate"
            placeholder="Linkedin Link"
            onChange={(e) => {
              setLinkedin(e.target.value)
            }}
            value={linkedin} />
        </div>
        <button
          className="btn waves-effect waves-light #039be5 light-blue darken-1"
          onClick={PostData}
        >
          Signup
        </button>
        <h5>
          <Link to="/login">Already have an account ?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signup;
