import { useState } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PostMenu from "./PostMenu";
import ReactsPopup from "./ReactsPopup";
import CreateComment from "./CreateComment";
import { Dots, Public } from "../../svg";
import "./style.css";

export default function Post({ post, user, profile }) {
    const [visible, setVisible] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="post" style={{ width: `${profile && "100%"}` }}>
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
                <div
                    className="post_header_right hover1"
                    onClick={() => setShowMenu((prev) => !prev)}
                >
                    <Dots color="#828387" />
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
                    <div className="reacts_count_imgs"></div>
                    <div className="reacts_count_num"></div>
                </div>
                <div className="to_right">
                    <div className="comments_count">13 comments</div>
                    <div className="share_count">1 share</div>
                </div>
            </div>

            <div className="post_actions">
                <ReactsPopup visible={visible} setVisible={setVisible} />
                <div
                    className="post_action hover1"
                    onMouseOver={() => {
                        setTimeout(() => {
                            setVisible(true);
                        }, 500);
                    }}
                    onMouseLeave={() => {
                        setTimeout(() => {
                            setVisible(false);
                        }, 500);
                    }}
                >
                    <i className="like_icon"></i>
                    <span>Like</span>
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
                <div className="comments_order"></div>
                <CreateComment user={user} />
            </div>

            {showMenu && (
                <PostMenu
                    userId={user.uid}
                    postUserId={post.user_id}
                    imagesLength={post.images?.length}
                    setShowMenu={setShowMenu}
                />
            )}
        </div>
    );
}
