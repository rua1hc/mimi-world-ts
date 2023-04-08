import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Timeline from "react-image-timeline";
// import Post from "../../comps/post";
import { Dots } from "../../svg";
// import { Public } from "../../svg";
require("react-image-timeline/dist/timeline.css");

export default function VertTimelinePosts({ posts, setPostIdPopup }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const l_events = posts.map((post) => {
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
        setEvents(l_events);
    }, [posts]);

    const handlePostPopup = (postId) => {
        console.log("postId:", postId);
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
                <div className="v__header_age" onClick={() => handlePostPopup(post._id)}>
                    {`${post.mi_age} tuổi ${post.mi_month} tháng`}
                </div>
                <div className="v__header_dots hover2" onClick={() => setPostIdPopup(post._id)}>
                    <Dots color="#828387" />
                </div>
            </div>
        );
    };

    const VertImageBody = (props) => {
        const { extras: post } = props.event;
        const [idx, setIdx] = useState(0);

        // autoplay enable
        // useEffect(() => {
        //     const interval = setInterval(() => handleNext(), 3000);
        //     return () => clearInterval(interval);
        // }, [idx]);

        const handleBack = () => {
            const nextIdx = idx === 0 ? post.images.length - 1 : idx - 1;
            setIdx(nextIdx);
        };
        const handleNext = () => {
            const nextIdx = idx === post.images.length - 1 ? 0 : idx + 1;
            setIdx(nextIdx);
        };
        const handleIndicator = (idx) => {
            setIdx(idx);
        };

        return (
            <div className="v__image_body">
                <div className="v__image_back" onClick={handleBack}>
                    &lt;
                </div>
                <div className="v__image_next" onClick={handleNext}>
                    &gt;
                </div>
                <div className="v__image_indicators">
                    {post.images.map((_, i) => (
                        <div
                            className={
                                i === idx ? "v__image_indicator-active" : "v__image_indicator"
                            }
                            onClick={() => handleIndicator(i)}
                            key={i}
                        ></div>
                    ))}
                </div>
                <img src={post.images[idx]} className="v__image" alt="" />
            </div>
        );
    };

    const VertTextBody = () => {
        return <div className="v__text_body"></div>;
    };

    const VertFooter = () => {
        return <div className="v__footer"></div>;
    };

    return (
        <Timeline
            events={events}
            customComponents={{
                header: VertHeader,
                imageBody: VertImageBody,
                textBody: VertTextBody,
                footer: VertFooter,
            }}
            denseLayout
            reverseOrder
        />
    );
}
