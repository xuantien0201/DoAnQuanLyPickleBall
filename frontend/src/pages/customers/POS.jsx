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

    const addToCart = (productToAdd) => { // Đổi tên tham số để tránh nhầm lẫn với state 'products'
        console.log('POS - Sản phẩm được thêm vào giỏ hàng:', productToAdd);
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item.id === productToAdd.id);

            // Lấy thông tin tồn kho thực tế từ danh sách sản phẩm
            const actualProduct = products.find(p => p.id === productToAdd.id);
            if (!actualProduct) {
                alert('Không tìm thấy thông tin tồn kho cho sản phẩm này.');
                return currentCart;
            }

            if (existingItem) {
                const newQuantity = existingItem.quantity + 1;
                if (newQuantity > actualProduct.stock) {
                    alert(`Không đủ hàng tồn kho cho ${productToAdd.name}. Chỉ còn ${actualProduct.stock} sản phẩm.`);
                    return currentCart;
                }
                return currentCart.map(item =>
                    item.id === productToAdd.id ? { ...item, quantity: newQuantity } : item
                );
            } else {
                if (1 > actualProduct.stock) { // Thêm 1 sản phẩm
                    alert(`Không đủ hàng tồn kho cho ${productToAdd.name}. Chỉ còn ${actualProduct.stock} sản phẩm.`);
                    return currentCart;
                }
                return [...currentCart, { ...productToAdd, quantity: 1 }];
            }
        });
    };

    const updateQuantity = (productId, amount) => {
        setCart(currentCart => {
            return currentCart.map(item => {
                if (item.id === productId) {
                    // Lấy thông tin tồn kho thực tế từ danh sách sản phẩm
                    const actualProduct = products.find(p => p.id === productId);
                    if (!actualProduct) {
                        alert('Không tìm thấy thông tin tồn kho cho sản phẩm này.');
                        return item; // Không thay đổi số lượng nếu không có thông tin tồn kho
                    }

                    const newQuantity = item.quantity + amount;

                    if (newQuantity <= 0) {
                        return null; // Xóa sản phẩm nếu số lượng <= 0
                    }

                    // Kiểm tra tồn kho chỉ khi tăng số lượng
                    if (amount > 0 && newQuantity > actualProduct.stock) {
                        alert(`Không đủ hàng tồn kho cho ${item.name}. Chỉ còn ${actualProduct.stock} sản phẩm.`);
                        return item; // Không cập nhật số lượng
                    }
                    return { ...item, quantity: newQuantity };
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
            const itemsToSend = cart.map(item => ({
                id: item.id, // Đây là product ID
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }));

            console.log('POS Checkout - Dữ liệu items đang được gửi:', itemsToSend); // THÊM DÒNG NÀY

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: itemsToSend, // Sử dụng mảng đã log
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
                    placeholder="Tìm kiếm sản phẩm..." // Đã sửa tiếng Việt
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
                            <p className="product-stock">Tồn kho: {product.stock}</p> {/* THÊM DÒNG NÀY */}
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar / Invoice */}
            <aside className="pos-sidebar">
                <div className="current-sale-card">
                    <h3 className="sale-title">Đơn hàng hiện tại</h3> 

                    <div className="sale-items">
                        {cart.length === 0 ? (
                            <div className="empty-sale">Chưa có sản phẩm</div> 
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
                        <div className="summary-row"><span>Tổng phụ:</span><span>{subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div> {/* Đã sửa tiếng Việt */}
                        <div className="summary-total-row"><span>Tổng cộng:</span><span>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div> {/* Đã sửa tiếng Việt */}
                    </div>

                    <form className="sale-form" onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
                        <label>Tên khách hàng *</label> {/* Đã sửa tiếng Việt */}
                        <input type="text" placeholder="Nhập tên khách hàng" value={customerName} onChange={(e) => setCustomerName(e.target.value)} /> {/* Đã sửa tiếng Việt */}

                        <label>Số điện thoại *</label> {/* Đã sửa tiếng Việt */}
                        <input type="text" placeholder="Nhập số điện thoại" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} /> {/* Đã sửa tiếng Việt */}

                        <label>Phương thức thanh toán *</label> {/* Đã sửa tiếng Việt */}
                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option>Tiền mặt</option>
                            <option>Chuyển khoản</option>
                        </select>

                        <div className="sale-actions">
                            <button type="button" className="btn-clear" onClick={clearAll}>Xóa tất cả</button> {/* Đã sửa tiếng Việt */}
                            <button type="submit" className="btn-complete">Hoàn tất thanh toán</button> {/* Đã sửa tiếng Việt */}
                        </div>
                    </form>
                </div>
            </aside>
        </div>
    );
}