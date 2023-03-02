import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import PulseLoader from "react-spinners/PulseLoader";

import ImagePreview from "./ImagePreview";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import PostError from "./PostError";
import AddToYourPost from "./AddToYourPost";

import dataURItoBlob from "../../helpers/dataURItoBlob";
import useClickOutside from "../../helpers/clickOutside";
// import { createPost } from "../../functions/createPost";
// import { uploadImages } from "../../functions/uploadImages";

import { fsAddPost } from "../../firebase/fsPost";
import { uploadImages } from "../../cloudinary/uploadImages";

import "react-datepicker/dist/react-datepicker.css";
import "./style.css";

export default function CreatePostPopup({ user, setVisible }) {
    const popup = useRef(null);
    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [showPrev, setShowPrev] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [images, setImages] = useState([]);
    const [background, setBackground] = useState("");
    const [mimiDate, setMimiDate] = useState(new Date());

    useClickOutside(popup, () => {
        setVisible(false);
    });

    const postSubmit = async () => {
        if (!user) {
            setError("💩Log in đi má🧻");
            return;
        }

        if (background) {
            setLoading(true);
            // const response = await createPost(null, background, text, null, user.id, user.token);
            const response = await fsAddPost(null, background, text, null, user, 1, 2, mimiDate);
            setLoading(false);
            if (response === "ok") {
                setBackground("");
                setText("");
                setVisible(false);
            } else {
                setError(response);
            }
        } else if (images && images.length) {
            setLoading(true);
            // const postImages = images.map((img) => {
            //     return dataURItoBlob(img);
            // });
            // const path = `${user.username}/postImages`;
            // let formData = new FormData();
            // formData.append("path", path);
            // postImages.forEach((image) => {
            //     formData.append("file", image);
            // });
            // const imageUrls = await uploadImages(formData, path, user.token);
            // const response = await createPost(
            //     null,
            //     null,
            //     text,
            //     imageUrls,
            //     user.id,
            //     user.token
            // );
            const imageUrls = await uploadImages(images);
            const response = await fsAddPost(null, null, text, imageUrls, user);
            setLoading(false);
            if (response === "ok") {
                setText("");
                setImages("");
                setVisible(false);
            } else {
                setError(response);
            }
        } else if (text) {
            // setLoading(true);
            // const response = await createPost(
            //     null,
            //     null,
            //     text,
            //     null,
            //     user.id,
            //     user.token
            // );
            // setLoading(false);
            // if (response === "ok") {
            //     setBackground("");
            //     setText("");
            //     setVisible(false);
            // } else {
            //     setError(response);
            // }
            console.log("do nothing");
        } else {
            console.log("do nothing");
        }
    };

    const calcMimiAge = () => {
        let toFullYear = mimiDate.getMonth() - 3;
        let month = toFullYear < 0 ? 9 + mimiDate.getMonth() : toFullYear;
        let age = toFullYear < 0 ? mimiDate.getFullYear() - 2021 : mimiDate.getFullYear() - 2020;
        switch (age) {
            case 0:
                return `🍼 Mimi 0️⃣ tuổi ${month} tháng 🍼`;
            case 1:
                return `🐭 Mimi 1️⃣ tuổi ${month} tháng 🐭`;
            case 2:
                return `🐹 Mimi 2️⃣ tuổi ${month} tháng 🐹`;
            case 3:
                return `🎵 Mimi 3️⃣ tuổi ${month} tháng 🎶`;
            case 4:
                return `🎼 Mimi 4️⃣ tuổi ${month} tháng 🎹`;
            case 5:
                return `🦄 Mimi 5️⃣ tuổi ${month} tháng 🦄`;
            case 6:
                return `🚀 Mimi 6️⃣ tuổi ${month} tháng 🚀`;
            default:
                return `🌈 Mimi ${age} tuổi ${month} tháng 🌈`;
        }
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
                            selected={mimiDate}
                            onChange={(date) => setMimiDate(date)}
                            showMonthDropdown
                            showYearDropdown
                            showPopperArrow={false}
                            minDate={new Date(2020, 3, 22)}
                            todayButton="Today"
                            dropdownMode="select"
                            dateFormat="dd-MMM-yyyy"
                            dayClassName={(date) =>
                                date.getMonth() != mimiDate.getMonth()
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
                        <span className="box_profile__mimi-age">{calcMimiAge()}</span>
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
