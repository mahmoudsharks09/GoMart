import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import SectionHeader from './SectionHeader';

function CartPage({ cart, products, updateCartQuantity, removeFromCart, totalCartValue }) {
  return (
    <Container className="py-5">
      <SectionHeader eyebrow="Checkout" title="Your shopping cart" />

      <Row className="g-4">
        <Col lg={8}>
          <div className="cart-list">
            {cart.length === 0 ? (
              <Card className="border-0 shadow-sm p-4 text-center">
                <h4>Your cart is empty</h4>
                <p className="text-muted">Add beautiful pieces to continue.</p>
                <Button href="#/products" variant="dark" className="rounded-pill mt-3 px-4">
                  Continue Shopping
                </Button>
              </Card>
            ) : (
              cart.map((entry) => {
                const product = products.find((item) => item.id === entry.id);
                if (!product) return null;

                return (
                  <Card key={product.id} className="cart-item border-0 shadow-sm mb-3">
                    <Card.Body className="d-flex gap-3 align-items-center flex-wrap">
                      <img src={product.image} alt={product.name} className="cart-thumb" />
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{product.name}</div>
                        <div className="text-muted small">{product.category}</div>
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
                        <Button variant="light" size="sm" onClick={() => updateCartQuantity(product.id, -1)}>
                          -
                        </Button>
                        <span className="fw-semibold px-2">{entry.quantity}</span>
                        <Button variant="light" size="sm" onClick={() => updateCartQuantity(product.id, 1)}>
                          +
                        </Button>
                      </div>
                      <div className="fw-semibold text-end" style={{ minWidth: 90 }}>
                        ${product.price * entry.quantity}
                      </div>
                      <Button variant="link" className="text-danger p-0 ms-2" onClick={() => removeFromCart(product.id)}>
                        Remove
                      </Button>
                    </Card.Body>
                  </Card>
                );
              })
            )}
          </div>
        </Col>

        <Col lg={4}>
          <Card className="summary-card border-0 shadow-sm p-3">
            <h4 className="mb-3">Order Summary</h4>
            <div className="d-flex justify-content-between text-muted mb-2">
              <span>Subtotal</span>
              <span>${Number(totalCartValue).toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between text-muted mb-2">
              <span>Shipping</span>
              <span>$25.00</span>
            </div>
            <div className="d-flex justify-content-between text-muted mb-2">
              <span>Tax</span>
              <span>$12.00</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold mb-3">
              <span>Total</span>
              <span>${(totalCartValue + 37).toFixed(2)}</span>
            </div>
            <Button variant="dark" className="w-100 rounded-pill py-2">Proceed to Checkout</Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CartPage;
