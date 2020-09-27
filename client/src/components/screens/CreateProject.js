import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const CreateProject = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const [video, setVideo] = useState("");
    const tokenData = localStorage.getItem("jwt");
    console.log(tokenData);

    useEffect(() => {
        if (url) {
            fetch("/createproject", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + tokenData,
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo: url,
                    video,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#e53935 red darken-1" });
                    } else {
                        M.toast({
                            html: "Created Post Succesfully",
                            classes: "#76ff03 light-green accent-3",
                        });
                        history.push("/explore");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [url])

    const PostDetails = () => {
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
                console.log(data);
                setUrl(data.url);
            })
            .catch((err) => console.log(err));

        // const newData = new FormData();
        // newData.append("file", video);
        // newData.append("upload_preset", "DevConnect");
        // newData.append("cloud_name", "devimg");

        // fetch("https://api.cloudinary.com/v1_1/devimg/image/upload", {
        //     method: "POST",
        //     body: newData,
        // }).then(res => res.json())
        //     .then(data => {
        //         console.log(data);
        //         setVideo(data.video);
        //     })
    };

    return (
        <div
            className="card input-filled"
            style={{
                margin: "30px auto",
                maxWidth: "500px",
                padding: "20px",
                textAlign: "center",
            }}
        >
            <input
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Image</span>
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
            {/*<div className="file-field input-field">
                <div className="btn">
                    <span>Upload Video</span>
                    <input
                        type="file"
                        onChange={(e) => {
                            setVideo(e.target.files[0]);
                        }}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path" type="text" />
                </div>
                    </div> */}
            <button
                className="btn waves-effect waves-light #039be5 light-blue darken-1"
                onClick={() => PostDetails()}
            >
                Submit Post
      </button>
        </div>
    );
};

export default CreateProject;
