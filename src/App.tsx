import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// import { fsGetPosts } from "./firebase/fsPost";
import { firestore } from "./firebase/firebase-config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
// import { postsReducer } from "./functions/reducers";

import Home from "./pages/home";
import Reset from "./pages/reset";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Friends from "./pages/friends";
import Activate from "./pages/activate/Activate";
import CreatePostPopup from "./comps/createPostPopup";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";
// import "./firebase/firebaseui-styling.global.css";

function App() {
    const { user, darkTheme } = useSelector((state: any) => ({ ...state }));
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        const q = query(collection(firestore, "posts"), orderBy("mi_date", "desc"));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), _id: doc.id })));
                setLoading(false);
            },
            (error) => {
                console.log(error);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, []);

    // const [{ loading, error, posts1 }, dispatch] = useReducer<(state: any, action: any) => any>(
    //     postsReducer,
    //     { loading: false, posts1: [], error: "" }
    // );

    // useEffect(() => {
    //     getAllPosts();
    // }, []);

    // const getAllPosts = async () => {
    //     try {
    //         dispatch({ type: "POSTS_REQUEST" });
    //         // const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllposts`, {
    //         //     headers: { Authorization: `Bearer ${user.token}` },
    //         // });
    //         const data = fsGetPosts();
    //         dispatch({ type: "POSTS_SUCCESS", payload: data });
    //     } catch (ex: any) {
    //         dispatch({ type: "POSTS_ERROR", payload: ex.message });
    //     }
    // };

    return (
        <div className={darkTheme ? "dark" : ""}>
            <ToastContainer position="bottom-right" theme="colored" />

            {visible && <CreatePostPopup user={user} setVisible={setVisible} />}

            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            setVisible={setVisible}
                            posts={posts}
                            loading={loading}
                            // getAllPosts={getAllPosts}
                        />
                    }
                />
                <Route path="/activate/:token" element={<Activate />} />

                <Route element={<LoggedInRoutes />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/:uid" element={<Profile />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/friends/:type" element={<Friends />} />
                </Route>

                <Route element={<NotLoggedInRoutes />}>
                    <Route path="/login" element={<Login />} />
                </Route>

                <Route path="/reset" element={<Reset />} />
            </Routes>
        </div>
    );
}

export default App;
