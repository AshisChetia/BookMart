import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';

const AddBook = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

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

    const categories = [
        'Fiction', 'Non-Fiction', 'Self-Help', 'Thriller', 'Romance',
        'Science Fiction', 'Biography', 'History', 'Business', 'Children'
    ];

    const conditions = [
        { value: 'new', label: 'New', description: 'Brand new, unopened' },
        { value: 'like_new', label: 'Like New', description: 'No visible wear, like new condition' },
        { value: 'good', label: 'Good', description: 'Minor wear, no major defects' },
        { value: 'fair', label: 'Fair', description: 'Visible wear but fully functional' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Submit to API
        console.log('Form submitted:', formData);
        navigate('/seller/books');
    };

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
                            <li className="text-text-primary font-medium">Add New Book</li>
                        </ol>
                    </nav>

                    {/* Page Header */}
                    <section className="mb-6">
                        <h1 className="text-xl sm:text-2xl font-light text-text-primary">
                            Add <span className="font-bold text-primary">New Book</span>
                        </h1>
                        <p className="text-sm text-text-secondary mt-1">Fill in the details to list your book for sale</p>
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
                                            placeholder="Enter book title"
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary"
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
                                            placeholder="Enter author name"
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">ISBN (optional)</label>
                                        <input
                                            type="text"
                                            name="isbn"
                                            value={formData.isbn}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 978-0-13-468599-1"
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary"
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
                                            placeholder="e.g., 10"
                                            min="1"
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary"
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
                                            placeholder="e.g., 299"
                                            min="1"
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary"
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
                                            placeholder="e.g., 450"
                                            min="1"
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary"
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
                                    placeholder="Describe your book - include details about the story, edition, any highlights or annotations, etc."
                                    rows={5}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
                                />
                            </div>

                            {/* Images */}
                            <div className="bg-background-alt border border-border rounded-xl p-5">
                                <h2 className="font-medium text-text-primary mb-4">Book Images</h2>
                                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                    <svg className="w-10 h-10 text-text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm text-text-primary mb-1">Click to upload images</p>
                                    <p className="text-xs text-text-muted">PNG, JPG up to 5MB each (max 5 images)</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 sm:flex-none px-8 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                                >
                                    Publish Book
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 sm:flex-none px-8 py-3 bg-background border border-border text-text-secondary text-sm font-medium rounded-lg hover:bg-background-alt transition-colors cursor-pointer"
                                >
                                    Save as Draft
                                </button>
                                <Link
                                    to="/seller/books"
                                    className="flex-1 sm:flex-none px-8 py-3 text-text-muted text-sm font-medium rounded-lg hover:text-text-primary transition-colors text-center"
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

export default AddBook;
