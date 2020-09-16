import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'

const Profile = () => {
  const [userProfile, setProfile] = useState(null)
  const { state, dispatch } = useContext(UserContext)
  const { userid } = useParams();
  //console.log(userid);
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then((res) => res.json())
      .then(result => {
        //console.log(result);
        setProfile(result);
      })
  }, [])
  //   console.log(mypics);
  return (
    <>
      {userProfile ?

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
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile.posts.length} Posts</h6>
                <h6>20 Followers</h6>
                <h6>20 Following</h6>
              </div>
            </div>
          </div>
          <div className="gallery">
            {
              userProfile.posts.map(item => {
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


        : <h2>Loading ...</h2>}

    </>
  );
};

export default Profile;
