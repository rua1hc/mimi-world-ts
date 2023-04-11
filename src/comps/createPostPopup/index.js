import { useRef, useState } from "react";
// import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import PulseLoader from "react-spinners/PulseLoader";

import ImagePreview from "./ImagePreview";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import PostError from "./PostError";
import AddToYourPost from "./AddToYourPost";

import useClickOutside from "../../helpers/clickOutside";
// import dataURItoBlob from "../../helpers/dataURItoBlob";
// import { createPost } from "../../functions/createPost";
// import { uploadImages } from "../../functions/uploadImages";

import { fsAddPost } from "../../firebase/fsPost";
import { uploadPostImages } from "../../cloudinary/uploadImages";

import "react-datepicker/dist/react-datepicker.css";
import "./style.css";

export default function CreatePostPopup({ user, setVisible }) {
    const popup = useRef(null);
    // const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [showPrev, setShowPrev] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [images, setImages] = useState([]);
    const [background, setBackground] = useState("");
    const [mimiDate, setMimiDate] = useState({ date: new Date(), age: 0, month: 0, toString: "" });

    useClickOutside(popup, () => {
        setVisible(false);
    });

    const postSubmit = async () => {
        if (!user) {
            setError("💩 Chưa log in má oi 🧻");
            return;
        }
        if (!mimiDate.toString) {
            setError(`💩 Quên chọn ngày lành kìa má ${user.displayName} 🧻`);
            return;
        }

        if (background) {
            setLoading(true);
            // const response = await createPost(null, background, text, null, user.id, user.token);
            const response = await fsAddPost(null, background, text, null, user, mimiDate);
            setLoading(false);
            if (response.status === "OK") {
                // dispatch({
                //     type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
                //     payload: [response.data, ...posts],
                // });
                setText("");
                setBackground("");
                setVisible(false);
            } else {
                setError(response);
            }
        } else if (images?.length) {
            setLoading(true);
            // const postImages = images.map((img) => dataURItoBlob(img));
            // const path = `${user.username}/postImages`;
            // let formData = new FormData();
            // formData.append("path", path);
            // postImages.forEach((image) => formData.append("file", image));
            // const imageUrls = await uploadImages(formData, path, user.token);
            // const response = await createPost(null, null, text, imageUrls, user.id, user.token);

            toast.info("Uploading photos...");
            const imageUrls = await uploadPostImages(
                images,
                `${mimiDate.age} age, ${mimiDate.month} month, ${user.displayName}`
            );
            if (imageUrls.NOT_OK) {
                setLoading(false);
                setError(imageUrls.NOT_OK);
                toast.error("Uploading photos failed!");
            } else if (imageUrls.length > 0) {
                let response = await fsAddPost(null, null, text, imageUrls, user, mimiDate);
                setLoading(false);
                if (response.status === "OK") {
                    // dispatch({
                    //     type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
                    //     payload: [res.data, ...posts],
                    // });
                    setText("");
                    setImages("");
                    setVisible(false);
                    toast.success(`${user.displayName} mới vẽ bậy lên tường!`);
                } else {
                    setError(response);
                    toast.error(response);
                }
            } else {
                console.log("do nothing");
            }
        } else if (text) {
            // setLoading(true);
            // const response = await createPost(null, null, text, null, user.id, user.token);
            // setLoading(false);
            // if (response.status === "ok") {
            //     dispatch({
            //         type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
            //         payload: [response.data, ...posts],
            //     });
            //     setText("");
            //     setBackground("");
            //     setVisible(false);
            // } else {
            //     setError(response);
            // }
            console.log("do nothing");
        } else {
            console.log("do nothing");
        }
    };

    const calcMimiAge = (date) => {
        // based on mimiBirthday = new Date(2020, 3, 22);
        let toFullYear = date.getMonth() - 3;
        let month = toFullYear < 0 ? 9 + date.getMonth() : toFullYear;
        let age = toFullYear < 0 ? date.getFullYear() - 2021 : date.getFullYear() - 2020;
        let toString = "";
        switch (age) {
            case 0:
                toString = `0️⃣ tuổi ${month} tháng 🍼`;
                break;
            case 1:
                toString = `1️⃣ tuổi ${month} tháng 🐁`;
                break;
            case 2:
                toString = `2️⃣ tuổi ${month} tháng 🐭`;
                break;
            case 3:
                toString = `3️⃣ tuổi ${month} tháng 🐹`;
                break;
            case 4:
                toString = `4️⃣ tuổi ${month} tháng 🎵`;
                break;
            case 5:
                toString = `5️⃣ tuổi ${month} tháng 🎶`;
                break;
            case 6:
                toString = `6️⃣ tuổi ${month} tháng 🦄`;
                break;
            default:
                toString = `${age} tuổi ${month} tháng 🌈`;
                break;
        }
        setMimiDate({ date, age, month, toString });
    };

    return (
        <div className="blur">
            <div className="postBox" ref={popup}>
                {error && <PostError error={error} setError={setError} />}
                <div className="box_header">
                    <div className="small_circle" onClick={() => setVisible(false)}>
                        <i className="exit_icon"></i>
                    </div>
                    <span>Create Post</span>
                    <div className="mimi_datepicker">
                        <DatePicker
                            showIcon
                            selected={mimiDate.date}
                            onChange={(date) => calcMimiAge(date)}
                            showMonthDropdown
                            showYearDropdown
                            showPopperArrow={false}
                            minDate={new Date(2020, 3, 22)}
                            todayButton="Today"
                            dropdownMode="select"
                            dateFormat="dd-MMM-yyyy"
                            dayClassName={(date) =>
                                date.getMonth() !== mimiDate.date.getMonth()
                                    ? "react-datepicker__day-not-month"
                                    : "react-datepicker__day-in-month"
                            }
                        />
                    </div>
                </div>

                <div className="box_profile">
                    <div className="box_profile__user_info">
                        <img
                            src={user?.photoURL || "../../../images/default_pic.png"}
                            alt=""
                            className="box_profile_img"
                        />
                        <div className="box_col">
                            <div className="box_profile_name">
                                {user?.displayName || "Mimi - Đi đu đưa thôi!"}
                            </div>
                            <div className="box_privacy">
                                <img src="../../../icons/public.png" alt="" />
                                <span>Public</span>
                                <i className="arrowDown_icon"></i>
                            </div>
                        </div>
                    </div>
                    <div className="box_profile__mimi_info">
                        {mimiDate.toString && (
                            <span className="box_profile__mimi-age">{mimiDate.toString}</span>
                        )}
                    </div>
                </div>

                {!showPrev ? (
                    <EmojiPickerBackgrounds
                        text={text}
                        user={user}
                        setText={setText}
                        // showPrev={showPrev}
                        setBackground={setBackground}
                        background={background}
                    />
                ) : (
                    <ImagePreview
                        text={text}
                        user={user}
                        setText={setText}
                        // showPrev={showPrev}
                        images={images}
                        setImages={setImages}
                        setShowPrev={setShowPrev}
                        setError={setError}
                    />
                )}

                <AddToYourPost setShowPrev={setShowPrev} />
                <button className="post_submit" onClick={() => postSubmit()} disabled={loading}>
                    {loading ? <PulseLoader color="#fff" size={5} /> : "Post"}
                </button>
            </div>
        </div>
    );
}
