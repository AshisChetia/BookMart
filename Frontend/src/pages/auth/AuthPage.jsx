import { useState } from 'react';
import { assets } from '../../assets/assets';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthPage = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode');
    const { login, signup } = useAuth();

    const [role, setRole] = useState(null); // 'reader' or 'seller'
    const [isLogin, setIsLogin] = useState(mode !== 'signup');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        address: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const result = await login(formData.email, formData.password);
                if (!result.success) {
                    setError(result.message);
                }
            } else {
                const signupData = {
                    ...formData,
                    role: role === 'seller' ? 'seller' : 'user'
                };
                const result = await signup(signupData);
                if (result.success) {
                    // Auto login after signup
                    const loginResult = await login(formData.email, formData.password);
                    if (!loginResult.success) {
                        setError('Account created! Please log in.');
                        setIsLogin(true);
                    }
                } else {
                    setError(result.message);
                }
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
    };
    const resetRole = () => {
        setRole(null);
        setError('');
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* === LEFT SIDE - VISUAL === */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden">
                <img
                    src={role === 'seller' ? assets.categories.nonFiction : assets.landing.featured}
                    alt="Auth Background"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute bottom-20 left-16 text-white max-w-lg">
                    <h2 className="font-serif text-5xl mb-6 leading-tight">
                        {role === 'seller'
                            ? "Share your collection with the world."
                            : "Discover stories that speak to you."}
                    </h2>
                    <p className="text-lg font-light opacity-90">
                        {role === 'seller'
                            ? "Join our community of curators and connect with passionate readers everywhere."
                            : "Explore a curated marketplace of rare finds, timeless classics, and new favorites."}
                    </p>
                </div>

                {/* Return Home Link */}
                <Link to="/" className="absolute top-8 left-8 text-white/80 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>
            </div>

            {/* === RIGHT SIDE - INTERACTION === */}
            <div className="w-full lg:w-1/2 min-h-screen lg:min-h-0 flex flex-col lg:flex-row items-center justify-center p-8 pt-6 bg-background relative overflow-y-auto">

                {/* Mobile Back to Home - Fixed at top */}
                <Link to="/" className="lg:hidden self-start mb-6 text-text-secondary hover:text-primary transition-colors flex items-center gap-2 text-sm uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Home
                </Link>

                <div className="max-w-md w-full flex-1 lg:flex-none flex flex-col justify-center">

                    {!role ? (
                        /* === ROLE SELECTION === */
                        <div className="animate-fade-in space-y-12 text-center">
                            <div>
                                <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">Join BookMart</span>
                                <h1 className="font-serif text-4xl mt-4 text-text-primary">How will you participate?</h1>
                            </div>

                            <div className="grid gap-6">
                                <button
                                    onClick={() => setRole('reader')}
                                    className="group relative p-8 border border-border hover:border-primary transition-all duration-300 text-left rounded-sm hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-serif text-2xl text-text-primary group-hover:text-primary transition-colors">I want to Buy</h3>
                                        <span className="text-2xl group-hover:scale-110 transition-transform">📖</span>
                                    </div>
                                    <p className="text-text-secondary text-sm leading-relaxed">
                                        Browse collections, purchase books, and curate your own library.
                                    </p>
                                </button>

                                <button
                                    onClick={() => setRole('seller')}
                                    className="group relative p-8 border border-border hover:border-primary transition-all duration-300 text-left rounded-sm hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-serif text-2xl text-text-primary group-hover:text-primary transition-colors">I want to Sell</h3>
                                        <span className="text-2xl group-hover:scale-110 transition-transform">🏷️</span>
                                    </div>
                                    <p className="text-text-secondary text-sm leading-relaxed">
                                        List your books, manage orders, and reach new readers.
                                    </p>
                                </button>
                            </div>

                            <p className="text-sm text-text-muted">
                                Already have an account? <button onClick={() => { setRole('reader'); setIsLogin(true) }} className="text-primary hover:underline underline-offset-4">Log in here</button>
                            </p>
                        </div>
                    ) : (
                        /* === AUTH FORMS === */
                        <div className="animate-fade-in">
                            <button
                                onClick={resetRole}
                                className="text-sm text-text-secondary hover:text-text-primary mb-8 flex items-center gap-2 group"
                            >
                                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Change Role
                            </button>

                            <div className="mb-10">
                                <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">
                                    {role === 'reader' ? 'Reader Access' : 'Seller Portal'}
                                </span>
                                <h1 className="font-serif text-4xl mt-3 text-text-primary">
                                    {isLogin ? 'Welcome Back' : 'Create Account'}
                                </h1>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {!isLogin && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase tracking-wider text-text-secondary font-medium">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullname"
                                                value={formData.fullname}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                                required={!isLogin}
                                                className="w-full bg-transparent border-b border-border focus:border-primary py-3 outline-none transition-colors text-text-primary placeholder:text-text-muted/50"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs uppercase tracking-wider text-text-secondary font-medium">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+91 98765 43210"
                                                    required={!isLogin}
                                                    className="w-full bg-transparent border-b border-border focus:border-primary py-3 outline-none transition-colors text-text-primary placeholder:text-text-muted/50"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs uppercase tracking-wider text-text-secondary font-medium">Address</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    placeholder="City, State"
                                                    required={!isLogin}
                                                    className="w-full bg-transparent border-b border-border focus:border-primary py-3 outline-none transition-colors text-text-primary placeholder:text-text-muted/50"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-1">
                                    <label className="text-xs uppercase tracking-wider text-text-secondary font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="name@example.com"
                                        required
                                        className="w-full bg-transparent border-b border-border focus:border-primary py-3 outline-none transition-colors text-text-primary placeholder:text-text-muted/50"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs uppercase tracking-wider text-text-secondary font-medium">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-transparent border-b border-border focus:border-primary py-3 outline-none transition-colors text-text-primary placeholder:text-text-muted/50"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-text-primary text-background py-4 font-medium hover:bg-primary transition-colors mt-8 cursor-pointer relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="relative z-10">
                                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Join BookMart')}
                                    </span>
                                    <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>
                            </form>

                            <div className="mt-8 text-center pt-8 border-t border-border">
                                <p className="text-text-secondary">
                                    {isLogin ? "New to BookMart?" : "Already a member?"}
                                    <button
                                        onClick={toggleMode}
                                        className="ml-2 text-primary font-medium hover:underline underline-offset-4"
                                    >
                                        {isLogin ? "Create an account" : "Log in"}
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile bottom spacing */}
                <div className="lg:hidden h-8" />
            </div>
        </div>
    );
};

export default AuthPage;
