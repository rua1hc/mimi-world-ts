// import { useState } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Timeline from "react-image-timeline";
// import Post from "../../comps/post";
import { Dots } from "../../svg";
// import { Public } from "../../svg";
require("react-image-timeline/dist/timeline.css");

export default function VertTimelinePosts({ posts, user }) {
    const events = posts.map((post) => {
        return {
            date: post.created_at.toDate(),
            text: "Default text..",
            title: "Default title..",
            buttonText: "Default Btn",
            imageUrl: post.images?.[0] || post.background,
            onClick: console.log,
            extras: post,
        };
    });

    const VertTextBody = () => {
        return <div className="v__text_body"></div>;
    };

    const VertFooter = () => {
        return <div className="v__footer"></div>;
    };

    const VertHeader = (props) => {
        const { extras: post } = props.event;

        return (
            <div className="v__header">
                <Link to={`/profile/${post.user_id}`} className="v__header_avatar">
                    <img src={post.user_photoURL} alt="" />
                    <div className="v__header_content">
                        <div className="v__header_author">{post.user_displayName}</div>
                        <div className="v__header_privacy_date">
                            <Moment fromNow interval={30}>
                                {post.created_at?.toDate()}
                            </Moment>
                            {/* <Public color="#828387" /> */}
                        </div>
                    </div>
                </Link>
                <div className="v__header_age" onClick={() => handleDefaultClick(post._id)}>
                    {`${post.mi_age} tuổi ${post.mi_month} tháng`}
                </div>
                <div className="v__header_dots hover2" onClick={() => handlePostPopup(post)}>
                    <Dots color="#828387" />
                </div>
            </div>
        );
    };

    const handlePostPopup = (post) => {
        console.log("post:", post);
    };

    const handleDefaultClick = (postId) => {
        console.log("postId:", postId);
    };

    return (
        <Timeline
            events={events}
            customComponents={{ header: VertHeader, textBody: VertTextBody, footer: VertFooter }}
            denseLayout
            reverseOrder
        />
    );
}
