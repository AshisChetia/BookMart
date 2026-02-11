import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const OrderInvoice = ({ order, onClose }) => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Invoice-${order._id}`,
    });

    if (!order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header Actions */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Invoice Details</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print Invoice
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Printable Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-white" ref={componentRef}>
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-100">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                            <p className="text-sm text-gray-500 mt-1">Order #{order._id.slice(-6).toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-bold text-xl text-green-700">BookMart</h3>
                            <p className="text-sm text-gray-500 mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize border border-gray-200">
                                Status: {order.status}
                            </div>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Bill To</h4>
                            <div className="text-sm text-gray-800">
                                <p className="font-bold text-base mb-1">{order.buyer?.fullname || 'Guest Customer'}</p>
                                <p className="mb-1">{order.buyer?.email}</p>
                                <p>{order.buyer?.phone || 'No phone provided'}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ship To</h4>
                            <div className="text-sm text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p className="leading-relaxed whitespace-pre-line">{order.shippingAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Item Table */}
                    <div className="mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Description</th>
                                    <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                                    <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <tr>
                                    <td className="py-4">
                                        <p className="font-bold text-gray-800">{order.book?.title || 'Unknown Book'}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">Author: {order.book?.author}</p>
                                    </td>
                                    <td className="py-4 text-right text-gray-600">{order.quantity}</td>
                                    <td className="py-4 text-right text-gray-600">₹{(order.totalAmount / order.quantity).toFixed(2)}</td>
                                    <td className="py-4 text-right font-medium text-gray-800">₹{order.totalAmount.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>₹0.00</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span className="font-bold text-lg text-gray-900">Total</span>
                                <span className="font-bold text-xl text-green-700">₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
                        <p>Thank you for shopping with BookMart!</p>
                        <p className="mt-1">For any queries, please contact support.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderInvoice;
