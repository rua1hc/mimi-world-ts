import { useRef, useState } from "react";
import { useSelector } from "react-redux";

import Stories from "../../comps/home/stories";
import LeftHome from "../../comps/home/left";
import RightHome from "../../comps/home/right";
import SendVerification from "../../comps/home/sendVerification";
// import Post from "../../comps/post";
import Header from "../../comps/header";
import PostPopup from "../../comps/postPopup";
import CreatePost from "../../comps/createPost";

import HorizontalTimeline from "../../comps/horizontalTimeline";

import DefaultModePost from "./DefaultModePosts";
import VertTimelinePosts from "./VertTimelinePosts";

import "./style.css";

export default function Home({ setVisible, posts, loading }) {
    const { user } = useSelector((state) => ({ ...state }));
    // const [height, setHeight] = useState();
    const [postIdPopup, setPostIdPopup] = useState("");
    const [isTimelineView, setIsTimelineView] = useState(true);
    const [timelineIdx, setTimelineIdx] = useState({ p_value: 0, c_value: 0 });

    const middle = useRef(null);
    // useEffect(() => {
    //     setHeight(middle.current.clientHeight);
    // }, [loading]);

    const calTimelineEvents = () => {
        const timelineEvents = [];
        const mimiBirthday = new Date(2020, 3, 22);
        const noEvents = new Date().getFullYear() - mimiBirthday.getFullYear();

        timelineEvents.push(new Date(2020, 9, 22).toString());
        for (let idx = 0; idx < noEvents; idx++) {
            let oneYearLater = new Date(2020 + idx + 1, 3, 22);
            if (oneYearLater.getFullYear() === new Date().getFullYear()) {
                if (oneYearLater - Date.now() < 0) {
                    timelineEvents.push(oneYearLater.toString());
                }
                timelineEvents.push(new Date().toString());
                break;
            }
            timelineEvents.push(oneYearLater.toString());
            timelineEvents.push(new Date(2020 + idx + 1, 9, 22).toString());
        }
        return timelineEvents;
    };
    const timelineEvents = calTimelineEvents();

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

                    <div className="h__horizontal_timeline">
                        <div style={{ width: "86%", height: "79px", margin: "0 auto" }}>
                            <HorizontalTimeline
                                values={timelineEvents}
                                index={timelineIdx.c_value}
                                indexClick={(index) =>
                                    setTimelineIdx((prev) => {
                                        return { c_value: index, p_value: prev.c_value };
                                    })
                                }
                            />
                        </div>
                        <div className="h__horizontal_timeline_body"></div>
                    </div>

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
