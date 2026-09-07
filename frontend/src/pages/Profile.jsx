import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        username: "",
        email: "",
        phone: "",
        profile_image: "",
    });

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        profile_image: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("vynora_access_token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetchProfile(token);
    }, [navigate]);

    const fetchProfile = async (token) => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/accounts/profile/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProfile(response.data);

            setFormData({
                email: response.data.email || "",
                phone: response.data.phone || "",
                profile_image: response.data.profile_image || "",
            });
        } catch (err) {
            console.error("Profile fetch error:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("vynora_access_token");
                navigate("/login");
            } else {
                setError("Unable to load profile.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("vynora_access_token");

        if (!token) {
            navigate("/login");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.patch(
                "http://127.0.0.1:8000/api/accounts/profile/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProfile(response.data);

            setFormData({
                email: response.data.email || "",
                phone: response.data.phone || "",
                profile_image: response.data.profile_image || "",
            });

            setEditing(false);
            setSuccess("Profile updated successfully.");
        } catch (err) {
            console.error("Profile update error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("vynora_access_token");
        localStorage.removeItem("vynora_refresh_token");

        navigate("/login");
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-container">

                {/* Page Header */}

                <div className="profile-page-heading">
                    <h2>My Profile</h2>
                    <p>Manage your account and personal information</p>
                </div>


                {/* Profile Layout */}

                <div className="profile-layout">

                    {/* Left Profile Card */}

                    <div className="profile-sidebar">

                        <div className="profile-user-card">

                            <div className="profile-avatar">

                                {profile.profile_image ? (
                                    <img
                                        src={profile.profile_image}
                                        alt="Profile"
                                    />
                                ) : (
                                    <span>
                                        {profile.username
                                            ? profile.username
                                                .charAt(0)
                                                .toUpperCase()
                                            : "U"}
                                    </span>
                                )}

                            </div>

                            <h3>{profile.username}</h3>

                            <p>{profile.email}</p>

                            <span className="profile-customer-badge">
                                Vynora Customer
                            </span>

                        </div>


                        {/* Sidebar Actions */}

                        <div className="profile-sidebar-links">

                            <button
                                type="button"
                                onClick={() => navigate("/orders")}
                            >
                                <span>My Orders</span>
                                <span>›</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/wishlist")}
                            >
                                <span>Wishlist</span>
                                <span>›</span>
                            </button>

                            <button
                                type="button"
                                className="logout-link"
                                onClick={handleLogout}
                            >
                                <span>Logout</span>
                                <span>›</span>
                            </button>

                        </div>

                    </div>


                    {/* Right Profile Content */}

                    <div className="profile-main-card">

                        <div className="profile-section-header">

                            <div>
                                <h3>Personal Information</h3>
                                <p>
                                    Update your personal details and contact information
                                </p>
                            </div>

                            {!editing && (
                                <button
                                    type="button"
                                    className="profile-edit-btn"
                                    onClick={() => {
                                        setEditing(true);
                                        setSuccess("");
                                    }}
                                >
                                    Edit
                                </button>
                            )}

                        </div>


                        {/* Messages */}

                        {error && (
                            <div className="profile-alert profile-alert-error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="profile-alert profile-alert-success">
                                {success}
                            </div>
                        )}


                        {/* Form */}

                        <form onSubmit={handleSave}>

                            <div className="profile-form-grid">

                                {/* Username */}

                                <div className="profile-field">

                                    <label>Username</label>

                                    <input
                                        type="text"
                                        value={profile.username}
                                        disabled
                                    />

                                    <small>
                                        Username cannot be changed.
                                    </small>

                                </div>


                                {/* Email */}

                                <div className="profile-field">

                                    <label>Email Address</label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />

                                </div>


                                {/* Phone */}

                                <div className="profile-field">

                                    <label>Mobile Number</label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />

                                </div>


                                {/* Profile Image */}

                                <div className="profile-field">

                                    <label>Profile Image URL</label>

                                    <input
                                        type="text"
                                        name="profile_image"
                                        value={formData.profile_image}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="Enter image URL"
                                    />

                                </div>

                            </div>


                            {/* Save / Cancel */}

                            {editing && (
                                <div className="profile-form-actions">

                                    <button
                                        type="submit"
                                        className="profile-save-btn"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>

                                    <button
                                        type="button"
                                        className="profile-cancel-btn"
                                        onClick={() => {
                                            setEditing(false);

                                            setFormData({
                                                email: profile.email || "",
                                                phone: profile.phone || "",
                                                profile_image:
                                                    profile.profile_image || "",
                                            });

                                            setError("");
                                            setSuccess("");
                                        }}
                                    >
                                        Cancel
                                    </button>

                                </div>
                            )}

                        </form>


                        {/* Account Information */}

                        <div className="profile-account-info">

                            <h3>Account Information</h3>

                            <div className="profile-info-row">
                                <span>Account Type</span>
                                <strong>Customer</strong>
                            </div>

                            <div className="profile-info-row">
                                <span>Username</span>
                                <strong>{profile.username}</strong>
                            </div>

                            <div className="profile-info-row">
                                <span>Email</span>
                                <strong>{profile.email}</strong>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;
