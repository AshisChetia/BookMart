import { useState, useEffect } from 'react';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SellerProfile = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        bio: '',
        profileImage: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await authAPI.getMe();
                if (response.data.success) {
                    const user = response.data.user;

                    // Parse name
                    const nameParts = user.fullname ? user.fullname.split(' ') : [''];
                    const firstName = nameParts[0] || '';
                    const lastName = nameParts.slice(1).join(' ') || '';

                    // Parse address from default address object
                    const defaultAddr = user.addresses?.find(a => a.isDefault) || user.addresses?.[0] || {};

                    setProfileData({
                        firstName,
                        lastName,
                        email: user.email || '',
                        phone: user.phone || '',
                        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                        gender: user.gender || 'Prefer not to say',
                        address: defaultAddr.addressLine || user.address || '',
                        city: defaultAddr.city || '',
                        state: defaultAddr.state || '',
                        pincode: defaultAddr.pincode || '',
                        bio: user.bio || '',
                        profileImage: user.profileImage || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const fullname = `${profileData.firstName} ${profileData.lastName}`.trim();
            const payload = {
                fullname,
                phone: profileData.phone,
                bio: profileData.bio,
                gender: profileData.gender,
                dateOfBirth: profileData.dateOfBirth,
                address: profileData.address,
                city: profileData.city,
                state: profileData.state,
                pincode: profileData.pincode,
                profileImage: profileData.profileImage
            };

            const response = await authAPI.updateProfile(payload);
            if (response.data.success) {
                toast.success('Profile updated successfully');
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background font-sans flex overflow-x-hidden">
                <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex flex-col min-h-screen min-w-0">
                    <SellerHeader onMenuClick={() => setSidebarOpen(true)} />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-sans flex overflow-x-hidden">
            <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                <SellerHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-y-auto overflow-x-hidden">
                    {/* Page Header */}
                    <section className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-light text-text-primary">
                                    My <span className="font-bold text-primary">Profile</span>
                                </h1>
                                <p className="text-sm text-text-secondary mt-1">Manage your personal information</p>
                            </div>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2.5 border border-border text-text-secondary text-sm font-medium rounded-lg hover:bg-background-alt transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Profile Header Card */}
                    <section className="mb-6">
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                {/* Profile Image */}
                                <div className="relative">
                                    {profileData.profileImage ? (
                                        <img
                                            src={profileData.profileImage}
                                            alt="Profile"
                                            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                                            onError={(e) => { e.target.onerror = null; e.target.src = ''; }} // Fallback to initials if error
                                        />
                                    ) : (
                                        <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                                            {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                                        </div>
                                    )}

                                    {isEditing && (
                                        <button className="absolute -bottom-1 -right-1 w-9 h-9 bg-white border border-border rounded-full flex items-center justify-center text-text-secondary hover:text-primary transition-colors cursor-pointer shadow-sm" title="Change Image URL">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="w-full sm:w-auto">
                                        <input
                                            type="text"
                                            name="profileImage"
                                            value={profileData.profileImage}
                                            onChange={handleInputChange}
                                            placeholder="Profile Image URL"
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                )}

                                {/* Basic Info */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h2 className="text-2xl font-bold text-text-primary">
                                        {profileData.firstName} {profileData.lastName}
                                    </h2>
                                    <p className="text-text-secondary mt-1">{profileData.email}</p>
                                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded">SELLER</span>
                                        <span className="text-sm text-text-muted">Member since Jan 2025</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="max-w-3xl space-y-6">
                        {/* Personal Information */}
                        <section className="bg-background-alt border border-border rounded-xl p-5">
                            <h3 className="font-medium text-text-primary mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-text-muted uppercase mb-1.5">First Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={profileData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    ) : (
                                        <p className="text-sm text-text-primary py-2">{profileData.firstName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted uppercase mb-1.5">Last Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={profileData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    ) : (
                                        <p className="text-sm text-text-primary py-2">{profileData.lastName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted uppercase mb-1.5">Email</label>
                                    <p className="text-sm text-text-primary py-2 bg-gray-50/50 rounded px-3 border border-transparent">{profileData.email}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted uppercase mb-1.5">Phone</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    ) : (
                                        <p className="text-sm text-text-primary py-2">{profileData.phone}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted uppercase mb-1.5">Date of Birth</label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={profileData.dateOfBirth}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    ) : (
                                        <p className="text-sm text-text-primary py-2">
                                            {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not set'}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted uppercase mb-1.5">Gender</label>
                                    {isEditing ? (
                                        <select
                                            name="gender"
                                            value={profileData.gender}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary cursor-pointer"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                    ) : (
                                        <p className="text-sm text-text-primary py-2">{profileData.gender}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Address */}
                        <section className="bg-background-alt border border-border rounded-xl p-5">
                            <h3 className="font-medium text-text-primary mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Address
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-text-muted uppercase mb-1.5">Street Address</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    ) : (
                                        <p className="text-sm text-text-primary py-2">{profileData.address || 'Not set'}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted uppercase mb-1.5">City</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="city"
                                            value={profileData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    ) : (
                                        <p className="text-sm text-text-primary py-2">{profileData.city || 'Not set'}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted uppercase mb-1.5">State</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="state"
                                            value={profileData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    ) : (
                                        <p className="text-sm text-text-primary py-2">{profileData.state || 'Not set'}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted uppercase mb-1.5">PIN Code</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={profileData.pincode}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    ) : (
                                        <p className="text-sm text-text-primary py-2">{profileData.pincode || 'Not set'}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Bio */}
                        <section className="bg-background-alt border border-border rounded-xl p-5">
                            <h3 className="font-medium text-text-primary mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                About Me
                            </h3>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <p className="text-sm text-text-secondary leading-relaxed">{profileData.bio || 'No bio provided'}</p>
                            )}
                        </section>

                        {/* Account Actions */}
                        <section className="bg-background-alt border border-border rounded-xl p-5">
                            <h3 className="font-medium text-text-primary mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Account Security
                            </h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 bg-background rounded-lg hover:bg-primary/5 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-text-primary">Change Password</p>
                                            <p className="text-xs text-text-muted">Update your account password</p>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 bg-background rounded-lg hover:bg-primary/5 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-text-primary">Two-Factor Authentication</p>
                                            <p className="text-xs text-text-muted">Add extra security to your account</p>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </section>
                    </div>
                </main>

                <footer className="border-t border-border py-4 px-4 md:px-6">
                    <p className="text-xs text-text-muted text-center">© 2026 BookMart. Seller Dashboard</p>
                </footer>
            </div>
        </div>
    );
};

export default SellerProfile;
