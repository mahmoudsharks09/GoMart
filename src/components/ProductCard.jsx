import { Card, Badge, Button } from 'react-bootstrap';

function ProductCard({ product, onView, onAddToCart }) {
  return (
    <Card className="product-card h-100 border-0 shadow-sm overflow-hidden">
      <div className="position-relative">
        <Card.Img variant="top" src={product.image} alt={product.name} className="product-image" />
        <Badge bg="light" text="dark" className="position-absolute top-3 start-3 rounded-pill px-3 py-2 fw-semibold">
          {product.badge}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-secondary small text-uppercase fw-semibold">{product.category}</span>
          <span className="text-warning">
            <i className="bi bi-star-fill me-1" />{product.rating}
          </span>
        </div>

        <Card.Title as="h5" className="mb-2 product-title">{product.name}</Card.Title>

        <p className="text-secondary small mb-3 flex-grow-1">{product.description}</p>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <span className="price-main">${product.price}</span>
            <span className="text-decoration-line-through text-muted ms-2 small">${product.originalPrice}</span>
          </div>
          <span className="text-muted small">{product.reviewCount} reviews</span>
        </div>

        <div className="d-flex gap-2">
          <Button variant="outline-dark" className="flex-fill rounded-pill" onClick={() => onView(product)}>
            View Details
          </Button>
          <Button variant="dark" className="flex-fill rounded-pill" onClick={() => onAddToCart(product)}>
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
