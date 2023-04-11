import { useState, useEffect } from "react";
import { firestore } from "./firebase-config";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import { doc, addDoc, updateDoc, collection, deleteDoc } from "firebase/firestore";
import { arrayUnion, arrayRemove, onSnapshot, query, orderBy } from "firebase/firestore";

const fsCollection = "posts";

// REF_NOT_TESTED
export function usePostsCollection() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const q = query(collection(firestore, fsCollection), orderBy("mi_date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) =>
            setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), post_id: doc.id })))
        );
        return unsubscribe;
    }, []);

    return posts;
}

// REF_NOT_TESTED
// export const fsGetPosts = async () => {
//     try {
//         const q = query(collection(firestore, fsCollection), orderBy("mi_date", "desc"));
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const posts = [];
//             snapshot.forEach((doc) => posts.push(doc.data()));
//         });
//         return [];
//     } catch (ex) {
//         return ex.message;
//     }
// };

export const fsGetPost = async (postId, user) => {
    try {
    } catch (ex) {
        return ex.message;
    }
};

export const fsAddPost = async (background, text, images, user, mimiDate) => {
    try {
        await addDoc(collection(firestore, fsCollection), {
            user_id: user.uid,
            user_displayName: user.displayName,
            user_photoURL: user.photoURL,
            background,
            text,
            images,
            mi_age: mimiDate.age,
            mi_month: mimiDate.month,
            mi_date: Timestamp.fromDate(mimiDate.date),
            created_at: serverTimestamp(),
        });
        return { status: "OK" };
    } catch (ex) {
        return ex.message;
    }
};

export const fsUpdatePost = async (postId, user) => {
    try {
    } catch (ex) {
        return ex.message;
    }
};

export const fsDeletePost = async (postId) => {
    try {
        await deleteDoc(doc(firestore, fsCollection, postId));
        return { status: "OK" };
    } catch (ex) {
        return ex.message;
    }
};

// Comment
export const fsAddComment = async (postId, text, image, user) => {
    try {
        await updateDoc(doc(firestore, fsCollection, postId), {
            comments: arrayUnion({
                user_photoURL: user.photoURL,
                user_displayName: user.displayName,
                text,
                image,
                created_at: Timestamp.now(),
            }),
        });
        return { status: "OK" };
    } catch (ex) {
        return ex.message;
    }
};

export const fsDeleteComment = async (postId, comment) => {
    try {
        await updateDoc(doc(firestore, fsCollection, postId), {
            comments: arrayRemove(comment),
        });
        return { status: "OK" };
    } catch (ex) {
        return ex.message;
    }
};
