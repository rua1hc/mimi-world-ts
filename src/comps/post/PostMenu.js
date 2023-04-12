import { useRef } from "react";
import { saveAs } from "file-saver";
import MenuItem from "./MenuItem";
import useOnClickOutside from "../../helpers/clickOutside";
// import { deletePost, savePost } from "../../functions/createPost";

export default function PostMenu({
    userId,
    postUserId,
    // postId,
    images,
    // imagesLength,
    setShowMenu,
    //   token,
    postRef,
    checkSaved,
    setCheckSaved,
    handleDelete,
}) {
    const menu = useRef(null);
    // const [test, setTest] = useState(postUserId === userId ? true : false);
    const test = postUserId === userId ? true : false;

    useOnClickOutside(menu, () => setShowMenu(false));

    const saveHandler = async () => {
        // savePost(postId, token);
        if (checkSaved) {
            setCheckSaved(false);
        } else {
            setCheckSaved(true);
        }
    };

    const downloadImages = async () => {
        images.forEach((img) => {
            let fileName = img.substring(img.lastIndexOf("/") + 1);
            saveAs(img, fileName);
        });
    };

    const archiveHandler = async () => {
        // const res = await deletePost(postId, token);
        const res = { status: "NOT_OK" };
        if (res.status === "ok") {
            postRef.current.remove();
        }
    };

    return (
        <ul className="post_menu" ref={menu}>
            {test && <MenuItem icon="pin_icon" title="Pin Post" />}
            <div onClick={() => saveHandler()}>
                {checkSaved ? (
                    <MenuItem
                        icon="save_icon"
                        title="Unsave Post"
                        subtitle="Remove this from your saved items."
                    />
                ) : (
                    <MenuItem
                        icon="save_icon"
                        title="Save Post"
                        subtitle="Add this to your saved items."
                    />
                )}
            </div>
            <div className="line"></div>

            {test && <MenuItem icon="edit_icon" title="Edit Post" />}
            {!test && (
                <MenuItem
                    icon="turnOnNotification_icon"
                    title="Turn on notifications for this post"
                />
            )}

            {images?.length && (
                <div onClick={() => downloadImages()}>
                    <MenuItem icon="download_icon" title="Download" />
                </div>
            )}
            {images?.length && <MenuItem icon="fullscreen_icon" title="Enter Fullscreen" />}

            {test && <MenuItem img="../../../icons/lock.png" title="Edit audience" />}
            {test && (
                <MenuItem
                    icon="turnOffNotifications_icon"
                    title="Turn off notifications for this post"
                />
            )}
            {test && <MenuItem icon="delete_icon" title="Turn off translations" />}
            {test && <MenuItem icon="date_icon" title="Edit Date" />}
            {test && <MenuItem icon="refresh_icon" title="Refresh share attachment" />}
            {test && (
                <div onClick={archiveHandler}>
                    <MenuItem icon="archive_icon" title="Move to archive" />
                </div>
            )}
            {test && (
                <div onClick={handleDelete}>
                    <MenuItem
                        icon="trash_icon"
                        title="Move to trash"
                        subtitle="Trash items are deleted after 30 days!"
                    />
                </div>
            )}
            {!test && <div className="line"></div>}
            {!test && (
                <MenuItem
                    img="../../../icons/report.png"
                    title="Report post"
                    subtitle="I'm concerned about this post."
                />
            )}
        </ul>
    );
}
