import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import Picker from "emoji-picker-react";
// import dataURItoBlob from "../../helpers/dataURItoBlob";
// import { comment } from "../../functions/createPost";
// import { uploadImages } from "../../functions/uploadImages";
import { fsAddComment } from "../../firebase/fsPost";
import { uploadCommentImages } from "../../cloudinary/uploadImages";

export default function CreateComment({ user, postId, setComments, setCount }) {
    const [picker, setPicker] = useState(false);
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const [commentImage, setCommentImage] = useState([]);
    const [cursorPosition, setCursorPosition] = useState();
    const [loading, setLoading] = useState(false);
    const textRef = useRef(null);
    const imgInput = useRef(null);

    useEffect(() => {
        textRef.current.selectionEnd = cursorPosition;
    }, [cursorPosition]);

    const handleEmoji = ({ emoji }, e) => {
        const ref = textRef.current;
        ref.focus();
        const start = text.substring(0, ref.selectionStart);
        const end = text.substring(ref.selectionStart);
        const newText = start + emoji + end;
        setText(newText);
        setCursorPosition(start.length + emoji.length);
    };

    const handleImage = (e) => {
        let file = e.target.files[0];
        if (
            file.type !== "image/jpeg" &&
            file.type !== "image/png" &&
            file.type !== "image/webp" &&
            file.type !== "image/gif"
        ) {
            setError(`${file.name} format is not supported!`);
            return;
        }

        if (file.size > 1024 * 1024 * 3) {
            setError(`${file.name} is too large max 3MB allowed!`);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            setCommentImage([event.target.result]);
        };
    };

    const handleCreateComment = async (e) => {
        if (e.key === "Enter") {
            let response = "";
            setLoading(true);
            if (commentImage.length > 0) {
                // const img = dataURItoBlob(commentImage);
                // const path = `${user.username}/post_images/${postId}`;
                // let formData = new FormData();
                // formData.append("path", path);
                // formData.append("file", img);
                // const imgComment = await uploadImages(formData, path, user.token);
                // const comments = await comment(postId, text, imgComment[0].url, user.token);
                // setComments(comments);

                toast.info("Uploading photos...");
                const imageUrls = await uploadCommentImages(
                    commentImage,
                    `comment, ${user.displayName}`
                );
                if (imageUrls.NOT_OK) {
                    response = imageUrls.NOT_OK;
                    toast.error("Uploading photos failed!");
                } else if (imageUrls.length === 1) {
                    response = await fsAddComment(postId, text, imageUrls[0], user);
                } else {
                    console.log("imageUrls.length !== 1");
                }
            } else {
                // const comments = await comment(postId, text, "", user.token);
                // setComments(comments);
                response = await fsAddComment(postId, text, "", user);
            }
            setLoading(false);

            if (response.status === "OK") {
                setCount((prev) => ++prev);
                setText("");
                setCommentImage("");
                toast.success(`${user.displayName} vừa nói xàm trên bài!`);
            } else {
                setError(response);
            }
        }
    };

    return (
        <div className="create_comment_wrap">
            <div className="create_comment">
                <img src={user?.photoURL || "../../../images/default_pic.png"} alt="" />
                <div className="comment_input_wrap">
                    {picker && (
                        <div className="comment_emoji_picker">
                            <Picker onEmojiClick={handleEmoji} />
                        </div>
                    )}
                    <input
                        type="file"
                        hidden
                        ref={imgInput}
                        accept="image/jpeg, image/png, image/gif, image/webp"
                        onChange={handleImage}
                    />
                    {error && (
                        <div className="postError comment_error">
                            <div className="postError_error">{error}</div>
                            <button className="blue_btn" onClick={() => setError("")}>
                                Try again
                            </button>
                        </div>
                    )}
                    <input
                        type="text"
                        ref={textRef}
                        value={text}
                        placeholder="Write a comment..."
                        onChange={(e) => setText(e.target.value)}
                        onKeyUp={handleCreateComment}
                    />
                    <div className="comment_circle">
                        <ClipLoader size={20} color="#1876f2" loading={loading} />
                    </div>
                    <div
                        className="comment_circle_icon hover2"
                        onClick={() => setPicker((prev) => !prev)}
                    >
                        <i className="emoji_icon"></i>
                    </div>

                    <div
                        className="comment_circle_icon hover2"
                        onClick={() => imgInput.current.click()}
                    >
                        <i className="camera_icon"></i>
                    </div>

                    <div className="comment_circle_icon hover2">
                        <i className="gif_icon"></i>
                    </div>
                    <div className="comment_circle_icon hover2">
                        <i className="sticker_icon"></i>
                    </div>
                </div>
            </div>

            {commentImage[0] && (
                <div className="comment_img_preview">
                    <img src={commentImage[0]} alt="" />
                    <div className="small_white_circle" onClick={() => setCommentImage("")}>
                        <i className="exit_icon"></i>
                    </div>
                </div>
            )}
        </div>
    );
}
