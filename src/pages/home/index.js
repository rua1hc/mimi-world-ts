import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Stories from "../../comps/home/stories";
import LeftHome from "../../comps/home/left";
import RightHome from "../../comps/home/right";
import SendVerification from "../../comps/home/sendVerification";
// import Post from "../../comps/post";
import Header from "../../comps/header";
import CreatePost from "../../comps/createPost";
import DefaultModePost from "./DefaultModePosts";
import VertTimelinePosts from "./VertTimelinePosts";

import "./style.css";

export default function Home({ setVisible, posts, loading }) {
    const { user } = useSelector((state) => ({ ...state }));
    const [height, setHeight] = useState();
    const [isTimelineView, setIsTimelineView] = useState(true);
    const middle = useRef(null);

    useEffect(() => {
        setHeight(middle.current.clientHeight);
    }, [loading]);

    return (
        // <div className="home">
        <div className="home" style={{ height: `${height + 80}px` }}>
            <Header page="home" />
            <LeftHome user={user} />

            <div className="home_middle" ref={middle}>
                <div className="home_middle__header">
                    <Stories user={user} />
                    <CreatePost
                        user={user}
                        setVisible={setVisible}
                        setIsTimelineView={setIsTimelineView}
                    />
                    <RightHome user={user} />
                </div>

                <div className="home_middle__content">
                    {/* {user.verified === false && <SendVerification user={user} />} */}
                    {user?.verified && <SendVerification user={user} />}

                    {isTimelineView ? (
                        <VertTimelinePosts posts={posts} />
                    ) : (
                        <DefaultModePost posts={posts} user={user} />
                    )}
                </div>
            </div>
        </div>
    );
}
