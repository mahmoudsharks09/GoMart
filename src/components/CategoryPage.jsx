import { Button, Card, Col, Container, Row } from 'react-bootstrap';

function CategoryPage({ categoryOptions, productCountByCategory, onSelectCategory, categoryMeta }) {
  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-end gap-3 mb-4 flex-wrap">
        <div>
          <p className="eyebrow mb-2">Categories</p>
          <h2 className="section-title mb-0">Browse by department</h2>
          <p className="text-muted mt-2 mb-0">
            Explore our product collections and discover what fits your style, routine, and lifestyle.
          </p>
        </div>
      </div>

      <Row className="g-4">
        {categoryOptions.map((category) => (
          <Col key={category} xs={12} md={6} lg={4}>
            <Card className="category-page-card border-0 shadow-sm h-100 overflow-hidden">
              <div
                className="category-image-top"
                style={{
                  backgroundImage: `url(${categoryMeta[category]?.image || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <Card.Body className="d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="category-page-title">{category}</h3>
                  <span className="badge rounded-pill bg-light text-dark">{productCountByCategory[category] || 0} items</span>
                </div>
                <p className="text-muted mb-4">
                  Fresh picks and trending essentials curated for a complete shopping experience.
                </p>
                <Button
                  variant="dark"
                  className="rounded-pill mt-auto px-4"
                  onClick={() => onSelectCategory(category)}
                >
                  View {category}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CategoryPage;
