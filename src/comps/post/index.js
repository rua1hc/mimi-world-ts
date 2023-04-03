import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PostMenu from "./PostMenu";
import ReactsPopup from "./ReactsPopup";
import Comment from "./Comment";
import CreateComment from "./CreateComment";
import { Dots, Public } from "../../svg";
// import { comment, getReacts, reactPost } from "../../functions/createPost";
import "./style.css";

export default function Post({ post, user, profile }) {
    const [visible, setVisible] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [check, setCheck] = useState();
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(2);
    const [reacts, setReacts] = useState([]);
    const [comments, setComments] = useState([]);
    const [checkSaved, setCheckSaved] = useState();
    const postRef = useRef(null);

    useEffect(() => {
        getPostReacts();
    }, [post]);

    useEffect(() => {
        // setComments(post?.comments);
        let fet_comments = post?.comments ? post.comments : [];
        setComments(fet_comments);
    }, [post]);

    const showMore = () => {
        setCount((prev) => prev + 3);
    };
    const getPostReacts = async () => {
        // const res = await getReacts(post._id, user.token);
        const res = {
            reacts: [
                { react: "haha", count: 13 },
                { react: "love", count: 11 },
                { react: "like", count: 9 },
                { react: "wow", count: 7 },
                { react: "sad", count: 5 },
                { react: "angry", count: 3 },
            ],
            check: "",
            total: 99,
            checkSaved: false,
        };
        setReacts(res.reacts);
        setCheck(res.check);
        setTotal(res.total);
        setCheckSaved(res.checkSaved);
    };

    const reactHandler = async (type) => {
        // reactPost(post._id, type, user.token);

        let nextReacts = [...reacts];
        if (check === type) {
            setCheck(null);
            let index = reacts.findIndex((x) => x.react === check);
            if (index !== -1) {
                // setReacts([...reacts, (reacts[index].count = --reacts[index].count)]);
                nextReacts[index].count--;
                setReacts(nextReacts);
                setTotal((prev) => --prev);
            }
        } else {
            setCheck(type);
            let index = reacts.findIndex((x) => x.react === type);
            let index1 = reacts.findIndex((x) => x.react === check);
            if (index !== -1) {
                // setReacts([...reacts, (reacts[index].count = ++reacts[index].count)]);
                nextReacts[index].count++;
                setTotal((prev) => ++prev);
            }
            if (index1 !== -1) {
                // setReacts([...reacts, (reacts[index1].count = --reacts[index1].count)]);
                nextReacts[index1].count--;
                setTotal((prev) => --prev);
            }
            setReacts(nextReacts);
        }
    };

    return (
        <div className="post" style={{ width: `${profile && "100%"}` }} ref={postRef}>
            <div className="post_header">
                <Link to={`/profile/${post.user_id}`} className="post_header_left">
                    <img src={post.user_photoURL} alt="" />
                    <div className="header_col">
                        <div className="post_profile_name">
                            {post.user_displayName}
                            <div className="updated_p">
                                {post.type === "profilePicture" && `updated profile picture`}
                                {post.type === "coverPicture" && `updated cover picture`}
                            </div>
                        </div>
                        <div className="post_profile_privacy_date">
                            <Moment fromNow interval={30}>
                                {post.created_at?.toDate()}
                            </Moment>
                            <Public color="#828387" />
                        </div>
                    </div>
                </Link>
                <div className="post_header_right_menu">
                    <div
                        className="post_header_right hover2"
                        onClick={() => setShowMenu((prev) => !prev)}
                    >
                        <Dots color="#828387" />
                    </div>
                    <div className="post_header_right hover2">
                        <i className="exit_icon"></i>
                    </div>
                </div>
            </div>

            {post.background ? (
                <div className="post_bg" style={{ backgroundImage: `url(${post.background})` }}>
                    <div className="post_bg_text">{post.text}</div>
                </div>
            ) : post.type === null ? (
                <>
                    <div className="post_text">{post.text}</div>
                    {post.images?.length && (
                        <div
                            className={
                                post.images.length === 1
                                    ? "grid_1"
                                    : post.images.length === 2
                                    ? "grid_2"
                                    : post.images.length === 3
                                    ? "grid_3"
                                    : post.images.length === 4
                                    ? "grid_4"
                                    : post.images.length >= 5 && "grid_5"
                            }
                        >
                            {post.images.slice(0, 5).map((image, i) => (
                                <img src={image} key={i} alt="" className={`img-${i}`} />
                            ))}
                            {post.images.length > 5 && (
                                <div className="more-pics-shadow">+{post.images.length - 5}</div>
                            )}
                        </div>
                    )}
                </>
            ) : post.type === "profilePicture" ? (
                <div className="post_profile_wrap">
                    <div className="post_updated_bg">
                        <img src={post.user.cover} alt="" />
                    </div>
                    <img src={post.images[0].url} alt="" className="post_updated_picture" />
                </div>
            ) : (
                <div className="post_cover_wrap">
                    <img src={post.images[0].url} alt="" />
                </div>
            )}

            <div className="post_infos">
                <div className="reacts_count">
                    <div className="reacts_count_imgs">
                        {reacts &&
                            reacts
                                .sort((a, b) => {
                                    return b.count - a.count;
                                })
                                .slice(0, 6)
                                .map(
                                    (react, i) =>
                                        react.count > 0 && (
                                            <img
                                                src={`../../../reacts/${react.react}.svg`}
                                                key={i}
                                                alt=""
                                            />
                                        )
                                )}
                    </div>
                    <div className="reacts_count_num">{total > 0 && total}</div>
                </div>
                <div className="to_right">
                    <div className="comments_count">{comments.length} comments</div>
                    <div className="share_count">? share</div>
                </div>
            </div>

            <div className="post_actions">
                <ReactsPopup visible={visible} setVisible={setVisible} reactHandler={reactHandler} />
                <div
                    className="post_action hover1"
                    onMouseOver={() => {
                        setTimeout(() => setVisible(true), 500);
                    }}
                    onMouseLeave={() => {
                        setTimeout(() => setVisible(false), 500);
                    }}
                    onClick={() => reactHandler(check ? check : "like")}
                >
                    {check ? (
                        <img
                            src={`../../../reacts/${check}.svg`}
                            className="small_react"
                            style={{ width: "18px" }}
                            alt=""
                        />
                    ) : (
                        <i className="like_icon"></i>
                    )}
                    <span
                        style={{
                            color: `
          ${
              check === "like"
                  ? "#4267b2"
                  : check === "love"
                  ? "#f63459"
                  : check === "haha"
                  ? "#f7b125"
                  : check === "sad"
                  ? "#f7b125"
                  : check === "wow"
                  ? "#f7b125"
                  : check === "angry"
                  ? "#e4605a"
                  : ""
          }
          `,
                        }}
                    >
                        {check ? check : "Like"}
                    </span>
                </div>
                <div className="post_action hover1">
                    <i className="comment_icon"></i>
                    <span>Comment</span>
                </div>
                <div className="post_action hover1">
                    <i className="share_icon"></i>
                    <span>Share</span>
                </div>
            </div>

            <div className="comments_wrap">
                <div className="comments_order">Most recent</div>
                <CreateComment
                    user={user}
                    postId={post._id}
                    setComments={setComments}
                    setCount={setCount}
                />
                {comments &&
                    comments
                        .sort((a, b) => {
                            return new Date(b.created_at) - new Date(a.created_at);
                        })
                        .slice(0, count)
                        .map((comment, i) => (
                            <Comment postId={post._id} comment={comment} key={i} />
                        ))}
                {count < comments.length && (
                    <div className="view_comments" onClick={() => showMore()}>
                        View more comments
                    </div>
                )}
            </div>

            {showMenu && (
                <PostMenu
                    userId={user.uid}
                    postUserId={post.user_id}
                    postId={post._id}
                    images={post.images}
                    // imagesLength={post.images?.length}
                    setShowMenu={setShowMenu}
                    // token={user.token}
                    checkSaved={checkSaved}
                    setCheckSaved={setCheckSaved}
                    postRef={postRef}
                />
            )}
        </div>
    );
}
