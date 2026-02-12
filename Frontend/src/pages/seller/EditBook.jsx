import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';
import { bookAPI, uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

const EditBook = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { bookId } = useParams();

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
    const [imageUploading, setImageUploading] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true);
                const response = await bookAPI.getBookById(bookId);
                console.log('API Response:', response.data); // DEBUG
                const book = response.data.book;
                console.log('Book Data:', book); // DEBUG
                console.log('Book Images:', book?.images); // DEBUG

                if (book) {
                    // Initialize images: use book.images if available and non-empty, otherwise fallback to [book.image] if it exists
                    let initialImages = book.images && book.images.length > 0 ? book.images : [];
                    if (initialImages.length === 0 && book.image) {
                        initialImages = [book.image];
                    }

                    setFormData({
                        title: book.title,
                        author: book.author,
                        isbn: book.isbn || '',
                        category: book.category,
                        condition: book.condition,
                        price: book.price.toString(),
                        originalPrice: book.originalPrice ? book.originalPrice.toString() : '',
                        stock: book.stock.toString(),
                        description: book.description || '',
                        images: initialImages,
                    });
                }
            } catch (error) {
                console.error('Error fetching book:', error);
                toast.error('Failed to load book details');
                navigate('/seller/books');
            } finally {
                setLoading(false);
            }
        };

        if (bookId) {
            fetchBook();
        }
    }, [bookId, navigate]);

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

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (formData.images.length + files.length > 2) {
            toast.error('You can only upload a maximum of 2 images');
            return;
        }

        setImageUploading(true);
        const uploadedUrls = [];

        try {
            for (const file of files) {
                if (file.size > 5 * 1024 * 1024) {
                    toast.error(`File ${file.name} is too large (max 5MB)`);
                    continue;
                }

                const data = new FormData();
                data.append('image', file);

                const response = await uploadAPI.uploadImage(data);
                if (response.data.success) {
                    uploadedUrls.push(response.data.url);
                }
            }

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls]
            }));
            toast.success('Images uploaded successfully');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload images');
        } finally {
            setImageUploading(false);
            e.target.value = '';
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                image: formData.images.length > 0 ? formData.images[0] : "", // Sync primary image
            };

            const response = await bookAPI.updateBook(bookId, payload);
            if (response.data.success) {
                toast.success('Book updated successfully');
                navigate('/seller/books');
            }
        } catch (error) {
            console.error('Error updating book:', error);
            toast.error(error.response?.data?.message || 'Failed to update book');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
            try {
                const response = await bookAPI.deleteBook(bookId);
                if (response.data.success) {
                    toast.success('Book deleted successfully');
                    navigate('/seller/books');
                }
            } catch (error) {
                console.error('Error deleting book:', error);
                toast.error(error.response?.data?.message || 'Failed to delete book');
            }
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
                                <h2 className="font-medium text-text-primary mb-4">Book Images (Max 2)</h2>

                                {/* Image Preview Grid */}
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        {formData.images.map((url, idx) => (
                                            <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border group bg-background-alt">
                                                <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-contain" />
                                                <button
                                                    type="button"
                                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => removeImage(idx)}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Button */}
                                {formData.images.length < 2 && (
                                    <label className="block border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={imageUploading}
                                        />
                                        {imageUploading ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                                                <p className="text-sm text-text-muted">Uploading...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="w-10 h-10 text-text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-sm text-text-primary mb-1">Click to upload images</p>
                                                <p className="text-xs text-text-muted">PNG, JPG up to 5MB</p>
                                            </>
                                        )}
                                    </label>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={imageUploading}
                                    className="flex-1 sm:flex-none px-8 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
