import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SellerHeader from '../../components/seller/SellerHeader';
import { bookAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SellerBooks = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await bookAPI.getSellerBooks();
                if (response.data.success) {
                    setBooks(response.data.books);
                }
            } catch (error) {
                console.error('Error fetching books:', error);
                toast.error('Failed to load your books');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const getBookStatus = (book) => {
        if (book.stock === 0) return 'out_of_stock';
        if (book.stock < 5) return 'low_stock';
        return 'active';
    };

    const filteredBooks = books.filter(book => {
        const status = getBookStatus(book);
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (status) => {
        const styles = {
            active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
            low_stock: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Low Stock' },
            out_of_stock: { bg: 'bg-red-100', text: 'text-red-700', label: 'Out of Stock' },
        };
        return styles[status] || styles.active;
    };

    const handleDeleteBook = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                const response = await bookAPI.deleteBook(id);
                if (response.data.success) {
                    toast.success('Book deleted successfully');
                    setBooks(books.filter(book => book._id !== id));
                }
            } catch (error) {
                console.error('Error deleting book:', error);
                toast.error('Failed to delete book');
            }
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
                                    My <span className="font-bold text-primary">Books</span>
                                </h1>
                                <p className="text-sm text-text-secondary mt-1">Manage your book inventory</p>
                            </div>
                            <Link
                                to="/seller/books/new"
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Book
                            </Link>
                        </div>
                    </section>

                    {/* Filters */}
                    <section className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1 max-w-md">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search books..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-background-alt border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                {['all', 'active', 'low_stock', 'out_of_stock'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer capitalize ${filterStatus === status
                                            ? 'bg-primary text-white'
                                            : 'bg-background-alt text-text-secondary hover:text-text-primary border border-border'
                                            }`}
                                    >
                                        {status.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Books Grid */}
                    <section>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                            {filteredBooks.map((book) => {
                                const status = getBookStatus(book);
                                const statusStyle = getStatusBadge(status);
                                return (
                                    <div key={book._id} className="bg-background-alt border border-border rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                                        <div className="relative aspect-[4/5] overflow-hidden">
                                            <img
                                                src={book.image}
                                                alt={book.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => e.target.src = assets.landing.featured}
                                            />
                                            <div className={`absolute top-2 right-2 px-1.5 py-0.5 ${statusStyle.bg} ${statusStyle.text} rounded text-[10px] font-medium`}>
                                                {statusStyle.label}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="text-xs font-medium text-text-primary line-clamp-1">{book.title}</h3>
                                            <p className="text-[10px] text-text-muted mt-0.5">{book.author}</p>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-bold text-primary">₹{book.price}</span>
                                                    {book.originalPrice > book.price && (
                                                        <span className="text-[10px] text-text-muted line-through">₹{book.originalPrice}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border text-[10px] text-text-secondary">
                                                <span>Stock: <strong className={book.stock <= 2 ? 'text-red-600' : 'text-text-primary'}>{book.stock}</strong></span>
                                            </div>

                                            <div className="flex gap-1.5 mt-3">
                                                <Link
                                                    to={`/seller/books/${book._id}/edit`}
                                                    className="flex-1 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded hover:bg-primary/20 transition-colors text-center"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteBook(book._id)}
                                                    className="px-2 py-1.5 border border-border rounded text-text-secondary hover:text-red-500 hover:border-red-500 transition-colors cursor-pointer"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filteredBooks.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 bg-background-alt rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-text-primary mb-2">No books found</h3>
                                <p className="text-text-secondary mb-6">{searchQuery || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'Start by adding your first book to sell'}</p>
                                {!searchQuery && filterStatus === 'all' && (
                                    <Link
                                        to="/seller/books/new"
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        Add Book Now
                                    </Link>
                                )}
                            </div>
                        )}
                    </section>
                </main>

                <footer className="border-t border-border py-4 px-4 md:px-6">
                    <p className="text-xs text-text-muted text-center">Showing {filteredBooks.length} of {books.length} books</p>
                </footer>
            </div>
        </div>
    );
};

export default SellerBooks;
