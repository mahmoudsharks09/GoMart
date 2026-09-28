import { Button, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HeroSection from './HeroSection';
import ProductCard from './ProductCard';
import SectionHeader from './SectionHeader';

function HomePage({
  categoryOptions,
  filteredProducts,
  groupedCollections,
  loading,
  error,
  addToCart,
  setSelectedCategory,
  categoryMeta,
}) {
  return (
    <>
      <HeroSection />

      <Container className="py-5">
        <SectionHeader
          eyebrow="Best sellers"
          title="Trending picks for everyday living"
          subtitle="Smart value on the products people love most right now."
          action={
            <Button as={Link} to="/products" variant="outline-dark" className="rounded-pill px-4">
              Browse all
            </Button>
          }
        />

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <span className="text-muted">Loading products...</span>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <Row className="g-4">
            {filteredProducts.slice(0, 4).map((product) => (
              <Col key={product.id} xs={12} sm={6} lg={3}>
                <ProductCard
                  product={product}
                  onView={(selected) => (window.location.hash = `#/products/${selected.id}`)}
                  onAddToCart={addToCart}
                />
              </Col>
            ))}
          </Row>
        )}

        <div className="mt-5">
          <SectionHeader
            eyebrow="Shop by style"
            title="Curated product stories"
            subtitle="Browse matching trends and collections that feel right for your lifestyle."
          />

          {groupedCollections.map((group) => (
            <div key={group.category} className="collection-block mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="collection-title">{group.category}</h3>
                <Button
                  as={Link}
                  to="/products"
                  variant="link"
                  className="text-dark p-0 text-decoration-none"
                  onClick={() => setSelectedCategory(group.category)}
                >
                  View collection
                </Button>
              </div>
              <Row className="g-4">
                {group.items.map((product) => (
                  <Col key={product.id} xs={12} sm={6} lg={4}>
                    <ProductCard
                      product={product}
                      onView={(selected) => (window.location.hash = `#/products/${selected.id}`)}
                      onAddToCart={addToCart}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </div>
      </Container>

      <footer className="site-footer">
        <Container>
          <Row className="g-4 justify-content-between">
            <Col md={5} lg={4}>
              <Link to="/" className="footer-brand text-decoration-none">
                <span className="brand-mark d-inline-flex align-items-center justify-content-center">
                  <i className="bi bi-shop" aria-hidden="true" />
                </span>
                <span>GoMart</span>
              </Link>
              <p className="footer-copy mt-3">
                Thoughtful finds, everyday essentials, and easy shopping for the way you live.
              </p>
            </Col>

            <Col xs={6} md={3} lg={2}>
              <h2 className="footer-heading">Shop</h2>
              <div className="footer-links">
                <Link to="/products">All products</Link>
                <Link to="/categories">Categories</Link>
                <Link to="/cart">Your cart</Link>
              </div>
            </Col>

            <Col xs={6} md={3} lg={2}>
              <h2 className="footer-heading">Account</h2>
              <div className="footer-links">
                <Link to="/login">Sign in</Link>
                <Link to="/checkout">Checkout</Link>
                <a href="mailto:hello@gomart.example">Contact us</a>
              </div>
            </Col>
          </Row>

          <div className="footer-bottom mt-5 pt-4">
            <span>© {new Date().getFullYear()} GoMart. All rights reserved.</span>
            <div className="footer-socials" aria-label="Social media links">
              <a href="https://instagram.com" aria-label="Instagram">
                <i className="bi bi-instagram" aria-hidden="true" />
              </a>
              <a href="https://facebook.com" aria-label="Facebook">
                <i className="bi bi-facebook" aria-hidden="true" />
              </a>
              <a href="mailto:hello@gomart.example" aria-label="Email GoMart">
                <i className="bi bi-envelope" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}

export default HomePage;
