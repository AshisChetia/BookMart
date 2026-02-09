import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';
import { assets } from '../../assets/assets';

const EditBook = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { bookId } = useParams();

    // Mock book data - replace with API fetch
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        category: '',
        condition: 'good',
        price: '',
        originalPrice: '',
        stock: '',
        description: '',
        images: [],
    });

    const [loading, setLoading] = useState(true);

    // Simulate fetching book data
    useEffect(() => {
        // Mock data - replace with API call
        const mockBooks = {
            1: { title: 'The Psychology of Money', author: 'Morgan Housel', isbn: '978-0857197689', category: 'self-help', condition: 'good', price: 299, originalPrice: 450, stock: 15, description: 'Timeless lessons on wealth, greed, and happiness.', image: assets.landing.featured },
            2: { title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', category: 'self-help', condition: 'like_new', price: 349, originalPrice: 499, stock: 8, description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.', image: assets.categories.selfHelp },
            3: { title: 'Deep Work', author: 'Cal Newport', isbn: '978-1455586691', category: 'business', condition: 'good', price: 325, originalPrice: 450, stock: 2, description: 'Rules for Focused Success in a Distracted World.', image: assets.categories.nonFiction },
        };

        setTimeout(() => {
            const book = mockBooks[bookId];
            if (book) {
                setFormData({
                    title: book.title,
                    author: book.author,
                    isbn: book.isbn || '',
                    category: book.category,
                    condition: book.condition,
                    price: book.price.toString(),
                    originalPrice: book.originalPrice.toString(),
                    stock: book.stock.toString(),
                    description: book.description || '',
                    images: book.image ? [book.image] : [],
                });
            }
            setLoading(false);
        }, 300);
    }, [bookId]);

    const categories = [
        'Fiction', 'Non-Fiction', 'Self-Help', 'Thriller', 'Romance',
        'Science Fiction', 'Biography', 'History', 'Business', 'Children'
    ];

    const conditions = [
        { value: 'new', label: 'New', description: 'Brand new, unopened' },
        { value: 'like_new', label: 'Like New', description: 'No visible wear' },
        { value: 'good', label: 'Good', description: 'Minor wear, no defects' },
        { value: 'fair', label: 'Fair', description: 'Visible wear but functional' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Submit to API
        console.log('Updated book:', formData);
        navigate('/seller/books');
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            // TODO: Delete via API
            navigate('/seller/books');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-text-secondary">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-sans flex overflow-x-hidden">
            <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                <SellerHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-y-auto overflow-x-hidden">
                    {/* Breadcrumb */}
                    <nav className="mb-4">
                        <ol className="flex items-center gap-2 text-sm">
                            <li><Link to="/seller/books" className="text-text-muted hover:text-primary transition-colors">My Books</Link></li>
                            <li className="text-text-muted">/</li>
                            <li className="text-text-primary font-medium">Edit Book</li>
                        </ol>
                    </nav>

                    {/* Page Header */}
                    <section className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-light text-text-primary">
                                    Edit <span className="font-bold text-primary">Book</span>
                                </h1>
                                <p className="text-sm text-text-secondary mt-1">Update your book listing</p>
                            </div>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    </section>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="max-w-4xl">
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="bg-background-alt border border-border rounded-xl p-5">
                                <h2 className="font-medium text-text-primary mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Book Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Author *</label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">ISBN</label>
                                        <input
                                            type="text"
                                            name="isbn"
                                            value={formData.isbn}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Category *</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary cursor-pointer"
                                            required
                                        >
                                            <option value="">Select category</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Stock Quantity *</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Condition */}
                            <div className="bg-background-alt border border-border rounded-xl p-5">
                                <h2 className="font-medium text-text-primary mb-4">Book Condition</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {conditions.map(cond => (
                                        <label
                                            key={cond.value}
                                            className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${formData.condition === cond.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="condition"
                                                value={cond.value}
                                                checked={formData.condition === cond.value}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <span className="text-sm font-medium text-text-primary">{cond.label}</span>
                                            <span className="text-xs text-text-muted mt-1">{cond.description}</span>
                                            {formData.condition === cond.value && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="bg-background-alt border border-border rounded-xl p-5">
                                <h2 className="font-medium text-text-primary mb-4">Pricing</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Selling Price (₹) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            min="1"
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Original/MRP Price (₹)</label>
                                        <input
                                            type="number"
                                            name="originalPrice"
                                            value={formData.originalPrice}
                                            onChange={handleInputChange}
                                            min="1"
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                                {formData.price && formData.originalPrice && (
                                    <p className="mt-3 text-sm text-green-600">
                                        Discount: {Math.round((1 - formData.price / formData.originalPrice) * 100)}% off
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="bg-background-alt border border-border rounded-xl p-5">
                                <h2 className="font-medium text-text-primary mb-4">Description</h2>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary resize-none"
                                />
                            </div>

                            {/* Current Images */}
                            <div className="bg-background-alt border border-border rounded-xl p-5">
                                <h2 className="font-medium text-text-primary mb-4">Book Images</h2>
                                {formData.images.length > 0 && (
                                    <div className="flex gap-3 mb-4">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="relative w-24 h-32 rounded-lg overflow-hidden border border-border">
                                                <img src={img} alt="Book" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs cursor-pointer"
                                                    onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                    <svg className="w-8 h-8 text-text-muted mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <p className="text-sm text-text-primary">Add more images</p>
                                    <p className="text-xs text-text-muted">PNG, JPG up to 5MB</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 sm:flex-none px-8 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                                >
                                    Save Changes
                                </button>
                                <Link
                                    to="/seller/books"
                                    className="flex-1 sm:flex-none px-8 py-3 border border-border text-text-secondary text-sm font-medium rounded-lg hover:bg-background-alt transition-colors text-center"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditBook;
