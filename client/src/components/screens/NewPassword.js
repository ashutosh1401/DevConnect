import React, { useState, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import M from "materialize-css";

const NewPassword = () => {
    const history = useHistory();
    const [password, setPassword] = useState("");
    const { token } = useParams();
    console.log(token);
    const PostData = () => {

        if (password.length <= 6) {
            M.toast({
                html: "Password must be larger than 6 char",
                classes: "#e53935 red darken-1",
            });
            return;
        }
        fetch("/new-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password,
                token,
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
    };
    return (
        <div className="login-card">
            <div className="card auth-card input-field">
                <h2>DevConnect</h2>
                <input
                    type="password"
                    placeholder="Enter a New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="btn waves-effect waves-light #039be5 light-blue darken-1"
                    onClick={() => PostData()}
                >
                    Update Password
        </button>
            </div>
        </div>
    );
};

export default NewPassword;
