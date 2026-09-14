import { Button, Col, Container, Row } from 'react-bootstrap';

function ProductDetailPage({ products, onAddToCart }) {
  const productId = Number(window.location.hash.split('/').pop());
  const product = products.find((entry) => entry.id === productId) || products[0];

  if (!product) {
    return <div className="text-center py-5">No product found.</div>;
  }

  return (
    <Container className="py-5">
      <div className="mb-4">
        <Button
          variant="outline-dark"
          className="rounded-pill px-4"
          onClick={() => window.history.back()}
        >
          ← Back to products
        </Button>
      </div>

      <Row className="g-4 align-items-start">
        <Col lg={6}>
          <div className="detail-gallery-main">
            <img src={product.gallery?.[0] || product.image} alt={product.name} />
          </div>
          <div className="d-flex gap-3 mt-3">
            {(product.gallery || [product.image]).map((image, index) => (
              <img key={`${product.id}-${index}`} src={image} alt={`${product.name} view ${index + 1}`} className="detail-thumb" />
            ))}
          </div>
        </Col>

        <Col lg={6}>
          <p className="eyebrow mb-2">{product.category}</p>
          <h2 className="section-title mb-3">{product.name}</h2>
          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="text-warning">★★★★★</span>
            <span className="text-muted">{product.rating} ({product.reviewCount} reviews)</span>
          </div>
          <div className="mb-3">
            <span className="price-main fs-3 me-3">${product.price}</span>
            <span className="text-decoration-line-through text-muted">${product.originalPrice}</span>
          </div>
          <p className="text-muted mb-4">{product.description}</p>

          <div className="d-flex gap-3 flex-wrap mb-4">
            <Button variant="dark" className="rounded-pill px-4" onClick={() => onAddToCart(product)}>
              Add to cart
            </Button>
          </div>

          <div className="product-feature-list">
            {product.features.map((feature) => (
              <div key={feature} className="feature-row">
                <i className="bi bi-check-circle-fill text-success me-2" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetailPage;
