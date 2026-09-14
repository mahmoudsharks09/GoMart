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
          eyebrow="Featured Categories"
          title="Shop by collection"
          subtitle="Find standout essentials across style, tech, home, beauty, and everyday favorites."
        />

        <Row className="g-4 mb-5">
          {categoryOptions
            .filter((category) => category !== 'All')
            .map((category) => (
              <Col key={category} xs={12} sm={6} md={4} lg={2}>
                <button
                  type="button"
                  className="category-tile w-100 text-start border-0 bg-white shadow-sm rounded-4 p-3"
                  onClick={() => {
                    setSelectedCategory(category);
                    window.location.hash = '#/categories';
                  }}
                >
                  <div
                    className="category-icon mb-3 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: categoryMeta[category]?.color || '#f3f4f6' }}
                  >
                    <i className={categoryMeta[category]?.icon || 'bi bi-box'} />
                  </div>
                  <div className="fw-semibold">{category}</div>
                </button>
              </Col>
            ))}
        </Row>

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

      </Container>
    </>
  );
}

export default HomePage;
