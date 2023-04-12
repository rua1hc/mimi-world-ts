import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
// import { Form, Formik } from "formik";
import SendEmail from "./SendEmail";
import SearchAccount from "./SearchAccount";
import ChangePassword from "./ChangePassword";
import CodeVerification from "./CodeVerification";
import Footer from "../../comps/login/Footer";
import "./style.css";

export default function Reset() {
    const { user } = useSelector((state) => ({ ...state }));

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(0);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [conf_password, setConf_password] = useState("");
    const [error, setError] = useState("");
    const [userInfos, setUserInfos] = useState("");

    const logout = () => {
        Cookies.set("user", "");
        dispatch({
            type: "LOGOUT",
        });
        navigate("/login");
    };

    return (
        <div className="reset">
            <div className="reset_header">
                <img src="../../../icons/facebook.svg" alt="" />
                {user ? (
                    <div className="right_reset">
                        <Link to="/profile">
                            <img src={user.photoURL} alt="" />
                        </Link>
                        <button className="blue_btn" onClick={() => logout()}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="right_reset">
                        <button className="blue_btn">Login</button>
                    </Link>
                )}
            </div>
            <div className="reset_wrap">
                {visible === 0 && (
                    <SearchAccount
                        email={email}
                        setEmail={setEmail}
                        error={error}
                        setError={setError}
                        setLoading={setLoading}
                        setUserInfos={setUserInfos}
                        setVisible={setVisible}
                    />
                )}
                {visible === 1 && userInfos && (
                    <SendEmail
                        email={email}
                        error={error}
                        setError={setError}
                        setLoading={setLoading}
                        userInfos={userInfos}
                        setUserInfos={setUserInfos}
                        setVisible={setVisible}
                    />
                )}
                {visible === 2 && (
                    <CodeVerification
                        user={user}
                        code={code}
                        setCode={setCode}
                        error={error}
                        setError={setError}
                        loading={loading}
                        setLoading={setLoading}
                        userInfos={userInfos}
                        setVisible={setVisible}
                    />
                )}
                {visible === 3 && (
                    <ChangePassword
                        password={password}
                        conf_password={conf_password}
                        setConf_password={setConf_password}
                        setPassword={setPassword}
                        error={error}
                        setError={setError}
                        setLoading={setLoading}
                        setVisible={setVisible}
                        userInfos={userInfos}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
}
