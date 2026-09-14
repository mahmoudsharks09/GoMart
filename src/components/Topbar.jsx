import { Navbar, Nav, Button, Badge } from 'react-bootstrap';

function Topbar({ cartCount, currentUser, onLogout }) {
  return (
    <Navbar bg="white" expand="lg" className="border-bottom sticky-top shadow-sm topbar-shell">
      <div className="container py-2">
        <Navbar.Brand href="#/" className="fw-bold brand-text d-flex align-items-center gap-2">
          <span className="brand-mark d-flex align-items-center justify-content-center">
            <i className="bi bi-shop" aria-label="GoMart logo" />
          </span>
          <span>GoMart</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="mx-auto gap-lg-3 nav-links">
            <Nav.Link href="#/">Home</Nav.Link>
            <Nav.Link href="#/products">Shop</Nav.Link>
            <Nav.Link href="#/categories">Categories</Nav.Link>
            {currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Moderator') ? (
              <Nav.Link href="#/dashboard">Dashboard</Nav.Link>
            ) : null}
          </Nav>

          <div className="d-flex align-items-center gap-3 ms-auto flex-wrap justify-content-end">
            <Button href="#/cart" variant="outline-dark" size="sm" className="rounded-pill px-3 position-relative">
              <i className="bi bi-cart3 me-2" />Cart
              <Badge bg="dark" className="rounded-pill position-absolute top-0 start-100 translate-middle">
                {cartCount}
              </Badge>
            </Button>

            {currentUser ? (
              <div className="d-flex align-items-center gap-2 user-chip">
                <div className="avatar-circle">{currentUser.name?.charAt(0) || 'U'}</div>
                <div>
                  <div className="fw-semibold small mb-0">{currentUser.name}</div>
                  <small className="text-muted">{currentUser.role}</small>
                </div>
                <Button size="sm" variant="link" className="text-dark p-0 ms-1" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button href="#/login" variant="dark" size="sm" className="rounded-pill px-3">
                Login
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Topbar;
