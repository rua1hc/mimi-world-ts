import Post from "../post";
import "./style.css";

export default function PostPopup({ posts, user, postIdPopup, setPostIdPopup }) {
    return (
        <div className="blur">
            <div className="post__popup">
                {posts
                    .filter((post) => post._id === postIdPopup)
                    .map((post) => (
                        <Post
                            key={post._id}
                            post={post}
                            user={user}
                            setPostIdPopup={setPostIdPopup}
                        />
                    ))}
            </div>
        </div>
    );
}
