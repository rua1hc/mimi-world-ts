import { Feeling, LiveVideo, Photo } from "../../svg";
// import UserMenu from "../header/userMenu";
import "./style.css";

export default function CreatePost({ user, setVisible, setIsTimelineView, profile }) {
    return (
        <div className="createPost">
            <div className="createPost_header">
                <img src={user?.photoURL || "../../../images/default_pic.png"} alt="" />
                <div className="open_post hover2" onClick={() => setVisible(true)}>
                    {user ? `Đưa Mi đi chơi, ${user.displayName}?` : "Đi đu đưa thôi, Mimi?"}
                </div>
            </div>
            <div className="create_splitter"></div>

            <div className="createPost_body_wrap">
                <div className="createPost_body">
                    <div className="createPost_icon hover1">
                        <LiveVideo color="#f3425f" />
                        Live Video
                    </div>
                    <div className="createPost_icon hover1">
                        <Photo color="#4bbf67" />
                        Photo/Video
                    </div>
                    {profile ? (
                        <div className="createPost_icon hover1">
                            <i className="lifeEvent_icon"></i>
                            Life Event
                        </div>
                    ) : (
                        <div className="createPost_icon hover1">
                            <Feeling color="#f7b928" />
                            Feeling/Activity
                        </div>
                    )}
                </div>

                <div className="createPost_body">
                    <div className="createPost_icon hover1" onClick={() => setIsTimelineView(true)}>
                        <i className="lifeEvent_icon"></i>
                        Timeline
                    </div>
                    <div className="createPost_icon hover1" onClick={() => setIsTimelineView(false)}>
                        <i className="lifeEvent_icon"></i>
                        Default
                    </div>
                    <div className="createPost_icon hover1">
                        <i className="lifeEvent_icon"></i>
                        More
                    </div>
                </div>
            </div>
        </div>
    );
}
