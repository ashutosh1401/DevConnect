import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Reset = () => {
    const history = useHistory();
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
        fetch("/reset-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
            }),
        }).then((res) => res.json())
            .then((data) => {
                //console.log(data);
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
    };
    return (
        <div className="login-card">
            <div className="card auth-card input-field">
                <h2>DevConnect</h2>
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    className="btn waves-effect waves-light #039be5 light-blue darken-1"
                    onClick={() => PostData()}
                >
                    Reset Password
        </button>
            </div>
        </div>
    );
};

export default Reset;
