import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'

const Profile = () => {
  const [userProfile, setProfile] = useState(null)
  const [showFollow, setFollow] = useState(true)
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

  const followUser = () => {
    fetch('/follow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        followId: userid
      })
    }).then(res => res.json())
      .then(data => {
        //console.log(data);
        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
        localStorage.setItem("user", JSON.stringify(data))
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id]
            }
          }
        })
        setFollow(false)
      }).catch(err => {
        console.log(err);
      })
  }

  const unfollowUser = () => {
    fetch('/unfollow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        unfollowId: userid
      })
    }).then(res => res.json())
      .then(data => {
        //console.log(data);
        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
        localStorage.setItem("user", JSON.stringify(data))
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(item => item !== data._id)
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower
            }
          }
        })
        setFollow(true)
      }).catch(err => {
        console.log(err);
      })
  }
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
                <h6>{userProfile.user.followers.length} Followers</h6>
                <h6>{userProfile.user.following.length} Following</h6>
              </div>
              {showFollow ? <button style={{ margin: "10px" }}
                className="btn waves-effect waves-light #039be5 light-blue darken-1"
                onClick={() => followUser()}
              >
                Follow
              </button> :
                <button style={{ margin: "10px" }}
                  className="btn waves-effect waves-light #039be5 light-blue darken-1"
                  onClick={() => unfollowUser()}
                >
                  UnFollow
            </button>
              }


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
