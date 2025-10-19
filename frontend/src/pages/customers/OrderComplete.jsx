import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/OrderComplete.css';

const OrderComplete = () => {
  const { orderCode } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderCode]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderCode}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  if (!order) {
    return <div className="loading">Loading order details...</div>;
  }

  return (
    <div className="order-complete-page">
      <div className="container">
        <h1 className="page-title">Complete!</h1>

        {/* Steps */}
        <div className="checkout-steps">
          <div className="step completed">
            <span className="step-number">✓</span>
            <span className="step-label">Shopping cart</span>
          </div>
          <div className="step completed">
            <span className="step-number">✓</span>
            <span className="step-label">Checkout details</span>
          </div>
          <div className="step active">
            <span className="step-number">3</span>
            <span className="step-label">Order complete</span>
          </div>
        </div>

        {/* Success Message */}
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2>Thank you!</h2>
          <p className="success-message">Your order has been received</p>

          <div className="order-items-preview">
            {order.items && order.items.slice(0, 3).map((item, index) => (
              <div key={item.id} className="item-preview">
                <div className="item-image">
                  <span className="item-badge">{index + 1}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="order-details">
            <div className="detail-item">
              <span className="detail-label">Order code:</span>
              <span className="detail-value">{order.order_code}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total:</span>
              <span className="detail-value">${order.total}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Payment method:</span>
              <span className="detail-value">
                {order.payment_method === 'card' ? 'Credit Card' : 'Paypal'}
              </span>
            </div>
          </div>

          <Link to="/shop" className="btn btn-primary">
            Purchase history
          </Link>
        </div>

        {/* Order Info */}
        <div className="order-info-section">
          <h3>Order Information</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>Shipping Address</h4>
              <p>{order.first_name} {order.last_name}</p>
              <p>{order.street_address}</p>
              <p>{order.town_city}, {order.state} {order.zip_code}</p>
              <p>{order.country}</p>
            </div>

            <div className="info-card">
              <h4>Contact Information</h4>
              <p>Email: {order.email}</p>
              <p>Phone: {order.phone}</p>
            </div>

            <div className="info-card">
              <h4>Payment & Shipping</h4>
              <p>Payment: {order.payment_method === 'card' ? 'Credit Card' : 'Paypal'}</p>
              <p>Shipping: {order.shipping_method}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-section">
          <h3>Order Items</h3>
          <div className="items-list">
            {order.items && order.items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <h4>{item.product_name}</h4>
                  {item.color && <p>Color: {item.color}</p>}
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${order.subtotal}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>${order.shipping_cost}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>${order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;
