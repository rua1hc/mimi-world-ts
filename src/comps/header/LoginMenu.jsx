import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    signInWithPopup,
    // signInWithRedirect,
    GoogleAuthProvider,
    FacebookAuthProvider,
} from "firebase/auth";
import { fsAddUser } from "../../firebase/fsUser";
import { firebaseAuth } from "../../firebase/firebase-config";
import { USER_LOGIN, USER_LOGOUT } from "../../reducers/actionTypes";

import {
    DiscordLoginButton,
    FacebookLoginButton,
    GoogleLoginButton,
    GithubLoginButton,
    InstagramLoginButton,
    TelegramLoginButton,
    TwitterLoginButton,
} from "react-social-login-buttons";
import { Gmail, FbLogo } from "../../svg";

// Configure FirebaseUI.
// const uiConfig = {
//     signInOptions: [
//         firebase.auth.EmailAuthProvider.PROVIDER_ID,
//         firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//         firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//         firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//         firebase.auth.GithubAuthProvider.PROVIDER_ID,
//     ],
// };

const styles = {
    login_menu_btn: {
        height: "40px",
        fontSize: "1rem",
        marginBottom: "1rem",
    },
};

export default function LoginMenu({ user, setShowLoginMenu }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const defaultSignIn = () => {
        toast("💩 Phím này làm màu cho dzui hoy..", {
            position: "top-center",
            theme: "light",
        });
    };

    const emailSignIn = () => {
        navigate("/login");
    };

    const googleSignIn = () => {
        const authProvider = new GoogleAuthProvider();
        signInWithPopup(firebaseAuth, authProvider)
            .then((result) => {
                const data = {
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                    uid: result.user.uid,
                    providerId: result.providerId,
                };
                fsAddUser(data);
                dispatch({ type: USER_LOGIN, payload: data });
                Cookies.set("user", JSON.stringify(data));
                toast.success(`Welcome, ${data.displayName}!`);
            })
            .catch((ex) => {
                toast.error(`${ex.code}: ${ex.message}`);
            });
        setShowLoginMenu((prev) => !prev);
    };

    const facebookSignIn = () => {
        const authProvider = new FacebookAuthProvider();
        signInWithPopup(firebaseAuth, authProvider)
            .then((result) => {
                let profilepic = JSON.parse(result._tokenResponse.rawUserInfo);
                let photoURL = profilepic.picture.data.url;
                const data = {
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL,
                    uid: result.user.uid,
                    providerId: result.providerId,
                };
                fsAddUser(data);
                dispatch({ type: USER_LOGIN, payload: data });
                Cookies.set("user", JSON.stringify(data));
                toast.success(`Welcome, ${data.displayName}!`);
            })
            .catch((ex) => {
                toast.error(`${ex.code}: ${ex.message}`);
            });
        setShowLoginMenu((prev) => !prev);
    };

    const defaultSignOut = async () => {
        await firebaseAuth.signOut();

        Cookies.set("user", "");
        dispatch({ type: USER_LOGOUT });
        // navigate("/login");
        setShowLoginMenu((prev) => !prev);
    };

    const partiallyEmailDisplay = (email) => {
        let elements = email.split("@");
        let prefix;
        if (elements[0].length > 3) {
            prefix = elements[0].substring(0, 3) + "*".repeat(elements[0].length - 3);
        } else {
            prefix = elements[0][0] + "*".repeat(elements[0].length - 1);
        }
        let ret = prefix + "@" + elements[1];
        return ret;
    };

    if (!user) {
        return (
            <div className="login_menu">
                <div className="login_menu_header">Welcome</div>

                <GoogleLoginButton icon={Gmail} style={styles.login_menu_btn} onClick={emailSignIn}>
                    <span>Log in with Email</span>
                </GoogleLoginButton>

                <GoogleLoginButton style={styles.login_menu_btn} onClick={googleSignIn} />
                <FacebookLoginButton style={styles.login_menu_btn} onClick={facebookSignIn} />

                <InstagramLoginButton style={styles.login_menu_btn} onClick={defaultSignIn} />
                <TwitterLoginButton style={styles.login_menu_btn} onClick={defaultSignIn} />
                <TelegramLoginButton style={styles.login_menu_btn} onClick={defaultSignIn} />
                <DiscordLoginButton style={styles.login_menu_btn} onClick={defaultSignIn} />
                <GithubLoginButton style={styles.login_menu_btn} onClick={defaultSignIn} />
            </div>
        );
    }

    return (
        <div className="logout_menu">
            <div className="logout_menu_header">
                <button className="logout_menu_title">
                    {user.providerId === "facebook.com" ? (
                        <FbLogo className="logout_menu_icon" />
                    ) : (
                        <Gmail className="logout_menu_icon" />
                    )}
                    <div className="logout_menu_email">{partiallyEmailDisplay(user.email)}</div>
                </button>

                <ul className="logout_menu_content">
                    <li>
                        <span>Admin</span>
                        <span>💩</span>
                    </li>
                    <li>
                        <span>Add post</span>
                        <span>💩</span>
                    </li>
                    <li>
                        <span>Edit post</span>
                        <span>💩</span>
                    </li>
                    <li>
                        <span>Delete post</span>
                        <span>💩</span>
                    </li>
                    <li>
                        <span>Comment post</span>
                        <span>💩</span>
                    </li>
                </ul>
            </div>

            <button className="logout_btn hvr-bounce-to-right" onClick={defaultSignOut}>
                Log Out
            </button>
        </div>
    );
}
