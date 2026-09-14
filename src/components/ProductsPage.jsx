import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import ProductCard from './ProductCard';
import SectionHeader from './SectionHeader';

function ProductsPage({
  categoryOptions,
  filteredProducts,
  loading,
  error,
  addToCart,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <Container className="py-5">
      <SectionHeader
        eyebrow="Collection"
        title="Shop all products"
        subtitle="Explore the best picks across all categories and styles."
      />

      <div className="d-flex gap-3 flex-wrap mb-4">
        <button
          type="button"
          className={`filter-pill ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('All')}
        >
          All
        </button>

        {categoryOptions
          .filter((category) => category !== 'All')
          .map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-pill ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Row className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.id} xs={12} sm={6} lg={4}>
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
  );
}

export default ProductsPage;
