import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App"
import { Link } from "react-router-dom"
import M from "materialize-css"

const Explore = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/getprojects', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then((res) => res.json()).then(result => {
            console.log(result);
            setData(result.project)
        })
    }, [])

    const likePost = (id) => {
        fetch("/likeproj", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                projId: id
            })
        }).then(res => res.json()).then(result => {
            //console.log(result);
            const newData = data.map(item => {
                if (item._id === result._id) {
                    return result;
                }
                else {
                    return item;
                }
            })
            setData(newData)
        }).catch(err => console.log(err))
    }
    const unlikePost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                projId: id
            })
        }).then(res => res.json()).then(result => {
            //console.log(result);
            const newData = data.map(item => {
                if (item._id === result._id) {
                    return result;
                }
                else {
                    return item;
                }
            })
            setData(newData)
        }).catch(err => console.log(err))
    }

    const makeComment = (text, projId) => {
        fetch('/commentproj', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                projId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const deletePost = (projid) => {
        fetch(`/deleteproj/${projid}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }

    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.carousel');
        var instances = M.Carousel.init(elems);
    });
    console.log(data);
    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{ padding: "7px" }}><Link to={item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : `/profile`}><img src={item.postedBy.pic} />{item.postedBy.name} </Link> {item.postedBy._id === state._id ? <i className="material-icons" style={{ float: "right" }} onClick={() => { deletePost(item._id) }}>delete</i> : ''}</h5>
                            <div className="card-image">
                                <div className="carousel carousel-slider">
                                    {item.photo ? <a className="carousel-item"><img src={item.photo} /></a> : ''}
                                    {item.video ? <a className="carousel-item"><video src={item.video}></video></a> : ''}
                                </div>
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id) ? <i className="material-icons" style={{ color: "red" }} onClick={() => unlikePost(item._id)}> favorite</i> : <i className="material-icons" onClick={() => likePost(item._id)}>favorite_border</i>}
                                <h6>{item.likes.length} Likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    makeComment(e.target[0].value, item._id);
                                }}>
                                    <input type="text" placeholder="comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default Explore;
