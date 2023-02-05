import { useState } from "react";
import axios from "axios";
import "./style.css";

export default function SendVerification({ user }) {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const sendVerificationLink = async () => {
        try {
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/sendVerification`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            setSuccess(data.message);
        } catch (ex) {
            setError(ex.response.data.message);
        }
    };

    return (
        <div className="send_verification">
            <span>
                Your account is not verified. Please verify your account before
                it gets deleted after a month!
            </span>
            <a
                href="/#"
                onClick={() => {
                    sendVerificationLink();
                }}
            >
                👉 Resend verification link 💬
            </a>
            {success && <div className="success_text">{success}</div>}
            {error && <div className="error_text">{error}</div>}
        </div>
    );
}
