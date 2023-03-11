import Moment from "react-moment";
import { Link } from "react-router-dom";
import { Dots, Public } from "../../svg";
import "./style.css";

export default function Post({ post }) {
    return (
        <div className="post">
            <div className="post_header">
                <Link to={`/profile/${post.user_id}`} className="post_header_left">
                    <img src={post.user_photoURL} alt="" />
                    <div className="header_col">
                        <div className="post_profile_name">
                            {post.user_displayName}
                            <div className="updated_p">
                                {post.type !== "profilePicture" && `updated profile picture`}
                                {post.type === "cover" && `updated cover picture`}
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
                <div className="post_header_right hover1">
                    <Dots color="#828387" />
                </div>
            </div>

            {post.background ? (
                <div className="post_bg" style={{ backgroundImage: `url(${post.background})` }}>
                    <div className="post_bg_text">{post.text}</div>
                </div>
            ) : (
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
            )}
        </div>
    );
}
