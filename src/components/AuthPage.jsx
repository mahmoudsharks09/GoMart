import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

function AuthPage({ authMode, setAuthMode, onSubmit, authError }) {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={7} lg={5}>
          <Card className="auth-card border-0 shadow-sm p-4">
            <div className="text-center mb-4">
              <div className="brand-mark mb-2">B</div>
              <h3 className="mb-1">{authMode === 'login' ? 'Welcome back' : 'Create account'}</h3>
              <p className="text-muted mb-0">
                {authMode === 'login'
                  ? 'Sign in to continue shopping.'
                  : 'Join our community for exclusive offers.'}
              </p>
            </div>

            {authError ? <div className="alert alert-danger py-2">{authError}</div> : null}

            <Form onSubmit={onSubmit}>
              {authMode === 'signup' ? (
                <Form.Group className="mb-3">
                  <Form.Label>Full name</Form.Label>
                  <Form.Control type="text" name="name" placeholder="Your name" />
                </Form.Group>
              ) : null}

              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" name="email" placeholder="you@example.com" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="********" required />
              </Form.Group>

              <Button variant="dark" type="submit" className="w-100 rounded-pill py-2">
                {authMode === 'login' ? 'Login' : 'Create account'}
              </Button>
            </Form>

            <div className="text-center mt-3 text-muted small">
              {authMode === 'login' ? 'Need an account?' : 'Already have an account?'}
              <button
                type="button"
                className="btn btn-link p-0 ms-1 text-decoration-none text-dark"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              >
                {authMode === 'login' ? 'Sign up' : 'Login'}
              </button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AuthPage;
