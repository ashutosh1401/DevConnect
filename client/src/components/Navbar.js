import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App"
import M from "materialize-css"

const NavBar = () => {
  const searchModal = useRef(null)
  const [search, setSearch] = useState('')
  const [userDetail, setUserDetail] = useState([])
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()
  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])
  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i data-target="modal1" className="large material-icons modal-trigger" style={{ color: "black" }}>search</i>
        </li>,
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/create">Create Post</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowing">Following Post</Link>
        </li>,
        <li key="5">
          <button
            className="btn #c62828 red darken-3"
            onClick={() => {
              localStorage.clear()
              dispatch({ type: "CLEAR" })
              history.push("/login")
            }}
          >
            Logout
        </button>
        </li>
      ]
    }
    else {
      return [<li key="6">
        <Link to="/login">Login</Link>
      </li>,
      <li key="7">
        <Link to="/signup">Signup</Link>
      </li>]
    }
  }
  const fetchUsers = (query) => {
    setSearch(query)
    fetch("/searchusers", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query
      })
    }).then(res => res.json())
      .then(result => {
        setUserDetail(result.user)
      })
  }

  return (
    <div>
      <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/login"} className="brand-logo left">
            DevConnect
          </Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
        <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
          <div className="modal-content">
            <input
              type="text"
              placeholder="Search Users"
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />

            <ul className="collection">
              {userDetail.map(item => {
                return <Link to={item._id !== state._id ? "/profile/" + item._id : "/profile"} onClick={() => {
                  M.Modal.getInstance(searchModal.current).close()
                  setSearch('')
                }}>
                  <li className="collection-item">{item.email}</li>
                </Link>
              })}
            </ul>
          </div>
          <div className="modal-footer">
            <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={() => { setSearch('') }}>Close</button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
