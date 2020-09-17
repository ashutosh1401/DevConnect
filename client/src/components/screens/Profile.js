import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../../App'
const Profile = () => {
  const [mypics, setPics] = useState([])
  const { state, dispatch } = useContext(UserContext)
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
  console.log(mypics);
  return (
    <div style={{ maxWidth: "550px", margin: "0px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "10px 0px",
          borderBottom: "1px solid black",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src="https://images.unsplash.com/photo-1598195596234-e04b82ef8adf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"
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
