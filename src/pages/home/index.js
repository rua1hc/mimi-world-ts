import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import HorizontalTimeline from "react-horizontal-timeline";

import Stories from "../../comps/home/stories";
import LeftHome from "../../comps/home/left";
import RightHome from "../../comps/home/right";
import SendVerification from "../../comps/home/sendVerification";
// import Post from "../../comps/post";
import Header from "../../comps/header";
import PostPopup from "../../comps/postPopup";
import CreatePost from "../../comps/createPost";

import DefaultModePost from "./DefaultModePosts";
import VertTimelinePosts from "./VertTimelinePosts";

import "./style.css";

export default function Home({ setVisible, posts, loading }) {
    const { user } = useSelector((state) => ({ ...state }));
    // const [height, setHeight] = useState();
    const [postIdPopup, setPostIdPopup] = useState("");
    const [isTimelineView, setIsTimelineView] = useState(true);

    const middle = useRef(null);
    // useEffect(() => {
    //     setHeight(middle.current.clientHeight);
    // }, [loading]);

    const VALUES = [
        "2008-06-01",
        "2010-06-01",
        "2013-06-01",
        "2015-03-01",
        "2019-01-01",
        "2019-06-17",
        "2019-08-01",
    ];

    return (
        <div
            className="home"
            // style={{ height: `${height + 80}px` }}
        >
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

                    {/* <div>
                        <div style={{ width: "60%", height: "100px", margin: "0 auto" }}>
                            <HorizontalTimeline
                                index={0}
                                indexClick={(index) => {
                                    // this.setState({ value: index, previous: this.state.value });
                                    console.log(index);
                                }}
                                values={VALUES}
                            />
                        </div>
                        <div className="text-center">
                            <div className="">children</div>
                        </div>
                    </div> */}

                    {postIdPopup && (
                        <PostPopup
                            posts={posts}
                            user={user}
                            postIdPopup={postIdPopup}
                            setPostIdPopup={setPostIdPopup}
                        />
                    )}
                    {isTimelineView ? (
                        <VertTimelinePosts posts={posts} setPostIdPopup={setPostIdPopup} />
                    ) : (
                        <DefaultModePost posts={posts} user={user} />
                    )}
                </div>
            </div>
        </div>
    );
}
