export default function Contact({ user }) {
    return (
        <div className="contact hover3">
            <div className="contact_img">
                <img src={user?.photoURL} alt="" />
            </div>
            <span>{user?.displayName}</span>
        </div>
    );
}
