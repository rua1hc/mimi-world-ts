import axios from "axios";
import { sha1 } from "crypto-hash";

// TODO
export const deletePostImages = async (images) => {
    const handlers = images.map(async (image) => {
        let publicId = image.substring(image.lastIndexOf("/") + 1, image.lastIndexOf("."));
        let public_id = `${process.env.REACT_APP_CLOUDINARY_FOLDER_POSTS}/${publicId}`;
        const timestamp = new Date().getTime();
        const signature = await sha1(
            `public_id=${public_id}&timestamp=${timestamp}${process.env.REACT_APP_CLOUDINARY_API_SECRET}`
        );
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/destroy`,
            {
                public_id,
                timestamp,
                signature,
                api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
            }
        );
        return response.data.result;
    });

    try {
        const result = await axios.all(handlers);
        if (result.some((r) => r !== "ok")) return "CloudinaryError";
        return { status: "OK" };
    } catch (ex) {
        return { NOT_OK: ex.message };
    }
};

export const deleteCommentImage = async (publicId) => {
    let public_id = `${process.env.REACT_APP_CLOUDINARY_FOLDER_COMMENTS}/${publicId}`;
    const timestamp = new Date().getTime();
    const signature = await sha1(
        `public_id=${public_id}&timestamp=${timestamp}${process.env.REACT_APP_CLOUDINARY_API_SECRET}`
    );

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/destroy`,
            {
                public_id,
                timestamp,
                signature,
                api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
            }
        );
        if (response.data.result === "ok") return { status: "OK" };
        return response.data.result;
    } catch (ex) {
        return ex.message;
    }
};
