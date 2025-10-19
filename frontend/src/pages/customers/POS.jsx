import React, { useState, useEffect } from 'react';
import '../../css/POS.css';

export function POS() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // New customer & payment state
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');

    useEffect(() => {
        // Lấy danh sách sản phẩm từ API
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Lỗi khi tải sản phẩm:", err));
    }, []);

    const addToCart = (product) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item.id === product.id);
            if (existingItem) {
                return currentCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, amount) => {
        setCart(currentCart => {
            return currentCart.map(item => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + amount;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            }).filter(Boolean); // Lọc bỏ sản phẩm có số lượng <= 0
        });
    };

    const removeItem = (productId) => {
        setCart(currentCart => currentCart.filter(i => i.id !== productId));
    };

    const clearAll = () => {
        setCart([]);
        setCustomerName('');
        setCustomerPhone('');
        setPaymentMethod('Tiền mặt');
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal;

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Giỏ hàng trống!");
            return;
        }

        // Basic validation for customer info
        if (!customerName.trim()) {
            alert("Vui lòng nhập tên khách hàng.");
            return;
        }
        if (!customerPhone.trim()) {
            alert("Vui lòng nhập số điện thoại khách hàng.");
            return;
        }

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Ánh xạ lại cấu trúc giỏ hàng cho phù hợp với backend
                    items: cart.map(item => ({
                        id: item.id,
                        name: item.name, // Thêm tên sản phẩm
                        price: item.price,
                        quantity: item.quantity
                    })),
                    total,
                    paymentMethod: paymentMethod,
                    status: 'Delivered',
                    customer: {
                        name: customerName,
                        phone: customerPhone
                    }
                })
            });
            if (!response.ok) {
                // Cải thiện xử lý lỗi để hiển thị thông báo từ server
                const errorData = await response.json().catch(() => ({ error: 'Thanh toán thất bại' }));
                throw new Error(errorData.error || 'Thanh toán thất bại');
            }
            alert('Thanh toán thành công!');
            clearAll();
        } catch (error) {
            console.error('Lỗi thanh toán:', error);
            alert(`Có lỗi xảy ra khi thanh toán: ${error.message}`);
        }
    };

    return (
        <div className="pos-container">
            <div className="pos-products">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="pos-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="product-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card-pos" onClick={() => addToCart(product)}>
                            <img src={product.image_url || '/images/default-product.png'} alt={product.name} />
                            <p>{product.name}</p>
                            <span>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar / Invoice */}
            <aside className="pos-sidebar">
                <div className="current-sale-card">
                    <h3 className="sale-title">Current Sale</h3>

                    <div className="sale-items">
                        {cart.length === 0 ? (
                            <div className="empty-sale">No items</div>
                        ) : cart.map(item => (
                            <div className="sale-item" key={item.id}>
                                <div className="sale-item-left">
                                    <div className="sale-item-name">{item.name}</div>
                                    <div className="sale-item-sub">
                                        <span className="price">{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                        <span className="qty">× {item.quantity}</span>
                                    </div>
                                </div>
                                <div className="sale-item-controls">
                                    <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                    <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                    <button className="remove-btn" onClick={() => removeItem(item.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="sale-summary">
                        <div className="summary-row"><span>Subtotal:</span><span>{subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
                        <div className="summary-total-row"><span>Total:</span><span>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
                    </div>

                    <form className="sale-form" onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
                        <label>Customer Name *</label>
                        <input type="text" placeholder="Enter customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />

                        <label>Phone Number *</label>
                        <input type="text" placeholder="Enter phone number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />

                        <label>Payment Method *</label>
                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option>Tiền mặt</option>
                            <option>Chuyển khoản</option>
                        </select>

                        <div className="sale-actions">
                            <button type="button" className="btn-clear" onClick={clearAll}>Clear</button>
                            <button type="submit" className="btn-complete">Complete Sale</button>
                        </div>
                    </form>
                </div>
            </aside>
        </div>
    );
}