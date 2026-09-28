import { useState } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import ProductCard from './ProductCard';
import SectionHeader from './SectionHeader';

const sortOptions = [
  { value: 'none', label: 'None' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to high' },
  { value: 'price-high', label: 'Price: High to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'name', label: 'Name: A to Z' },
];

function ProductsPage({
  categoryOptions,
  filteredProducts,
  loading,
  error,
  addToCart,
  selectedCategory,
  setSelectedCategory,
}) {
  const [sortBy, setSortBy] = useState('none');
  const sortedProducts = sortBy === 'none' ? filteredProducts : [...filteredProducts].sort((first, second) => {
    if (sortBy === 'price-low') return first.price - second.price;
    if (sortBy === 'price-high') return second.price - first.price;
    if (sortBy === 'rating') return second.rating - first.rating;
    if (sortBy === 'name') return first.name.localeCompare(second.name);

    const firstDate = first.dateAdded ? Date.parse(first.dateAdded) : Number(first.id);
    const secondDate = second.dateAdded ? Date.parse(second.dateAdded) : Number(second.id);
    return secondDate - firstDate;
  });

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

      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-4">
        <label className="d-flex align-items-center gap-2">
          <span className="small fw-semibold">Sort by</span>
          <select
            className="form-select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Sort products"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <span className="text-secondary small" aria-live="polite">
          {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : sortedProducts.length === 0 ? (
        <p className="text-secondary py-4">No products match your search.</p>
      ) : (
        <Row className="g-4">
          {sortedProducts.map((product) => (
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
