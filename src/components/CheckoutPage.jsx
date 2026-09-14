import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

function CheckoutPage({ cart, products, totalCartValue, onPlaceOrder, currentUser }) {
  const [isPlaced, setIsPlaced] = useState(false);

  const shippingFee = cart.length > 0 ? 15 : 0;
  const taxFee = totalCartValue * 0.08;
  const grandTotal = totalCartValue + shippingFee + taxFee;

  const handleSubmit = (event) => {
    event.preventDefault();
    onPlaceOrder();
    setIsPlaced(true);
  };

  if (isPlaced) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={7}>
            <Card className="border-0 shadow-sm p-4 text-center success-card">
              <div className="success-icon mb-3">
                <i className="bi bi-check-circle-fill" />
              </div>
              <h2 className="section-title mb-3">Order placed successfully</h2>
              <p className="text-muted mb-4">
                Thank you for shopping with GoMart. Your order is confirmed and will be on the way soon.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button href="#/products" variant="dark" className="rounded-pill px-4">
                  Continue Shopping
                </Button>
                <Button href="#/" variant="outline-dark" className="rounded-pill px-4">
                  Back Home
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-4">
        <p className="eyebrow mb-2">Checkout</p>
        <h2 className="section-title mb-0">Complete your order</h2>
      </div>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="checkout-card border-0 shadow-sm p-4">
            <h4 className="mb-3">Shipping details</h4>
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>First name</Form.Label>
                    <Form.Control type="text" defaultValue={currentUser?.name?.split(' ')[0] || ''} placeholder="First name" required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type="text" defaultValue={currentUser?.name?.split(' ').slice(1).join(' ') || ''} placeholder="Last name" required />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" defaultValue={currentUser?.email || ''} placeholder="you@example.com" required />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Street, apartment, suite" required />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" placeholder="City" required />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>State</Form.Label>
                    <Form.Control type="text" placeholder="State" required />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>ZIP code</Form.Label>
                    <Form.Control type="text" placeholder="ZIP" required />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <h4 className="mt-4 mb-3">Payment</h4>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Card number</Form.Label>
                    <Form.Control type="text" placeholder="1234 5678 9012 3456" required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Expiry date</Form.Label>
                    <Form.Control type="text" placeholder="MM/YY" required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>CVV</Form.Label>
                    <Form.Control type="text" placeholder="123" required />
                  </Form.Group>
                </Col>
              </Row>

              <Button type="submit" variant="dark" className="w-100 rounded-pill py-2 mt-4">
                Place order
              </Button>
            </Form>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="summary-card border-0 shadow-sm p-4">
            <h4 className="mb-3">Order summary</h4>

            {cart.length === 0 ? (
              <p className="text-muted mb-0">Your cart is empty.</p>
            ) : (
              <div className="checkout-items mb-4">
                {cart.map((entry) => {
                  const product = products.find((item) => item.id === entry.id);
                  if (!product) return null;

                  return (
                    <div key={product.id} className="checkout-item d-flex gap-3 align-items-center py-2">
                      <img src={product.image} alt={product.name} className="checkout-thumb" />
                      <div className="flex-grow-1">
                        <div className="fw-semibold small">{product.name}</div>
                        <div className="text-muted small">Qty: {entry.quantity}</div>
                      </div>
                      <div className="fw-semibold">${(product.price * entry.quantity).toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="d-flex justify-content-between text-muted mb-2">
              <span>Subtotal</span>
              <span>${Number(totalCartValue).toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between text-muted mb-2">
              <span>Shipping</span>
              <span>${shippingFee.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between text-muted mb-2">
              <span>Tax</span>
              <span>${taxFee.toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CheckoutPage;
