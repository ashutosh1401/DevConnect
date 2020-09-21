import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../../App'
const Profile = () => {
  const [mypics, setPics] = useState([])
  const { state, dispatch } = useContext(UserContext)
  const [image, setImage] = useState("")
  const [url, setUrl] = useState(undefined)
  console.log(state);
  useEffect(() => {
    fetch('/myposts', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then((res) => res.json())
      .then(result => {
        console.log(result);
        setPics(result.result)
      })
  }, [])
  //console.log(mypics);
  useEffect(() => {
    if (image) {
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
          console.log(data);

          fetch('/updatepic', {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
              pic: data.url
            })
          }).then(res => res.json())
            .then(result => {
              console.log(result)
              localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
              dispatch({ type: "UPDATEPIC", payload: result.pic })
              //window.location.reload()
            })
        })
        .catch((err) => console.log(err));
    }
  }, [image])
  const updatePhoto = (file) => {
    setImage(file)

  }
  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          margin: "10px 0px",
          borderBottom: "1px solid black",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-around",
        }}>
          <div>
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              src={state ? state.pic : "Loading..."}
              alt="profileimg"
            />
          </div>
          <div>
            <h4>{state ? state.name : "Loading.."}</h4>
            <h5>{state ? state.email : "Loading.."}</h5>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h6>{mypics.length} Posts</h6>
              <h6>{state ? state.followers.length : "0"} Followers</h6>
              <h6>{state ? state.following.length : "0"} Following</h6>
            </div>
          </div>
          {state.github ? <a href={state.github}><i className="fab fa-github fa-3x"></i></a> : ''}
          {state.linkedin ? <a href={state.linkedin}><i className="fab fa-linkedin fa-3x"></i></a> : ''}
        </div>
        <div className="file-field input-field" style={{ margin: "10px" }}>
          <div className="btn #64b5f6 blue darken-1">
            <span>Update Pic</span>
            <input
              type="file"
              onChange={(e) => {
                updatePhoto(e.target.files[0]);
              }}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className="gallery">
        {
          mypics.map(item => {
            return (
              <img
                key={item._id}
                className="item"
                src={item.photo}
                alt={item.title}
              />
            )
          })
        }
      </div>
    </div>
  );
};

export default Profile;
