import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import HelpSupport from "./HelpSupport";
import SettingsPrivacy from "./SettingsPrivacy";
import DisplayAccessibility from "./DisplayAccessibility";
import CurrentUser from "./CurrentUser";

export default function UserMenu({ user }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(0);

    const logout = () => {
        Cookies.set("user", "");
        dispatch({
            type: "LOGOUT",
        });
        navigate("/login");
    };

    return (
        <div className="mmenu">
            {visible === 0 && (
                <div>
                    <CurrentUser user={user} />
                    {/* <Link to="/profile" className="mmenu_header hover2">
                        <img src={user?.photoURL} alt="" />
                        <div className="mmenu_col">
                            <span>{user?.displayName}</span>
                            <span>See your profile</span>
                        </div>
                    </Link>
                    <div className="mmenu_splitter"></div> */}

                    <div className="mmenu_main hover1">
                        <div className="small_circle">
                            <i className="report_filled_icon"></i>
                        </div>
                        <div className="mmenu_col">
                            <div className="mmenu_span1">Give feedback</div>
                            <div className="mmenu_span2">
                                Help us improve facebook
                            </div>
                        </div>
                    </div>
                    <div className="mmenu_splitter"></div>

                    <div
                        className="mmenu_item hover3"
                        onClick={() => {
                            setVisible(1);
                        }}
                    >
                        <div className="small_circle">
                            <i className="settings_filled_icon"></i>
                        </div>
                        <span>Settings & privacy</span>
                        <div className="rArrow">
                            <i className="right_icon"></i>
                        </div>
                    </div>
                    <div
                        className="mmenu_item hover3"
                        onClick={() => {
                            setVisible(2);
                        }}
                    >
                        <div className="small_circle">
                            <i className="help_filled_icon"></i>
                        </div>
                        <span>Help & support</span>
                        <div className="rArrow">
                            <i className="right_icon"></i>
                        </div>
                    </div>
                    <div
                        className="mmenu_item hover3"
                        onClick={() => {
                            setVisible(3);
                        }}
                    >
                        <div className="small_circle">
                            <i className="dark_filled_icon"></i>
                        </div>
                        <span>Display & Accessibility</span>
                        <div className="rArrow">
                            <i className="right_icon"></i>
                        </div>
                    </div>
                    <div className="mmenu_item hover3" onClick={() => logout()}>
                        <div className="small_circle">
                            <i className="logout_filled_icon"></i>
                        </div>
                        <span>Logout</span>
                    </div>
                </div>
            )}
            {visible === 1 && <SettingsPrivacy setVisible={setVisible} />}
            {visible === 2 && <HelpSupport setVisible={setVisible} />}
            {visible === 3 && <DisplayAccessibility setVisible={setVisible} />}
        </div>
    );
}
