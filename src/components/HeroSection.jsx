import { Button, Col, Container, Row } from 'react-bootstrap';

function HeroSection() {
  return (
    <section className="hero-section">
      <Container className="py-5">
        <Row className="align-items-center g-4">
          <Col lg={6} className="pe-lg-5">
            {/* <p className="eyebrow text-uppercase mb-3">New collection</p> */}
            <h1 className="display-4 fw-bold hero-title mb-4">
              Everything You Need. One Place.
            </h1>
            <p className="lead text-muted mb-4">
              Shop a curated mix of tech, beauty, fashion, home must-haves, and daily essentials that fit real life.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Button href="#/products" variant="dark" className="rounded-pill px-4 py-2">
                Shop Now
              </Button>
            </div>

          </Col>

          <Col lg={6}>
            <div className="hero-visual-card">
              <div className="hero-image-large" />
              <div className="floating-card card-one">
                <span className="small text-muted">Popular</span>
                <strong>Fresh Grocery Picks</strong>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="text-warning">★★★★★</span>
                  <span className="fw-bold">$49</span>
                </div>
              </div>
              <div className="floating-card card-two">
                <span className="small text-muted">Featured </span>
                <strong>Weekend Deals</strong>
                <div className="fw-bold mt-2">Up to 40% off</div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default HeroSection;
