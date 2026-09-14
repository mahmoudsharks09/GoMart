import { useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { authUsers } from '../data/authUsers';

const defaultProductForm = {
  title: '',
  category: 'Tech Essentials',
  price: '',
  description: '',
  brand: '',
  stock: '',
};

const productImageMap = {
  'Tech Essentials': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  'Fashion Edit': 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  'Beauty & Care': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  'Home & Living': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  'Everyday Finds': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
  'Drive & Travel': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
};

function getProductImage(category, description = '') {
  const text = `${category} ${description}`.toLowerCase();

  if (text.includes('shirt') || text.includes('dress') || text.includes('bag') || text.includes('fashion')) {
    return productImageMap['Fashion Edit'];
  }

  if (text.includes('skincare') || text.includes('cream') || text.includes('beauty') || text.includes('care')) {
    return productImageMap['Beauty & Care'];
  }

  if (text.includes('chair') || text.includes('lamp') || text.includes('home') || text.includes('decor') || text.includes('living')) {
    return productImageMap['Home & Living'];
  }

  if (text.includes('groceries') || text.includes('food') || text.includes('kitchen') || text.includes('basket')) {
    return productImageMap['Everyday Finds'];
  }

  if (text.includes('car') || text.includes('travel') || text.includes('ride') || text.includes('auto')) {
    return productImageMap['Drive & Travel'];
  }

  return productImageMap[category] || productImageMap['Tech Essentials'];
}

function DashboardPage({
  products,
  users,
  carts,
  currentUser,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onCreateCart,
}) {
  const [form, setForm] = useState(defaultProductForm);
  const [editingId, setEditingId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userPage, setUserPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const dashboardUsers = useMemo(() => {
    return authUsers.map((user) => ({
      id: `saved-${user.email}`,
      firstName: user.name?.split(' ')[0] || 'User',
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      email: user.email,
      role: user.role || 'User',
    }));
  }, []);

  const apiUsers = useMemo(() => {
    return (users || []).map((user) => {
      const savedUser = authUsers.find((saved) => saved.email.toLowerCase() === String(user.email || '').toLowerCase());
      const role = savedUser?.role || (user.role || 'Customer');
      return {
        id: user.id,
        firstName: user.firstName || 'User',
        lastName: user.lastName || '',
        email: user.email || `user${user.id}@example.com`,
        role,
        phone: user.phone || 'N/A',
        company: user.company?.name || 'GoMart',
        gender: user.gender || 'N/A',
      };
    });
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    return apiUsers.filter((user) => {
      const matchesSearch =
        !query ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query);

      const matchesRole = userRoleFilter === 'All' || user.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [apiUsers, userRoleFilter, userSearch]);

  const userRoleOptions = ['All', ...new Set(apiUsers.map((user) => user.role))];
  const userTotalPages = Math.max(1, Math.ceil(filteredUsers.length / 5));
  const paginatedUsers = filteredUsers.slice((userPage - 1) * 5, userPage * 5);

  const handleUserPageChange = (nextPage) => {
    setUserPage(Math.min(Math.max(nextPage, 1), userTotalPages));
  };

  const summary = useMemo(() => {
    const productCount = products.length;
    const userCount = dashboardUsers.length;
    const cartCount = 0;
    const revenue = 0;

    return { productCount, userCount, cartCount, revenue };
  }, [products, dashboardUsers]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const productImage = getProductImage(form.category, form.description);

    const payload = {
      title: form.title.trim(),
      category: form.category,
      price: Number(form.price || 0),
      description: form.description.trim() || 'New product',
      brand: form.brand.trim() || 'JJ Buys',
      stock: Number(form.stock || 0),
      thumbnail: productImage,
      images: [productImage, productImage],
    };

    if (editingId) {
      onUpdateProduct(editingId, payload);
      setAlertMessage('Product updated successfully.');
    } else {
      onAddProduct(payload);
      setAlertMessage('Product added successfully.');
    }

    setForm(defaultProductForm);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.name,
      category: product.category,
      price: String(product.price),
      description: product.description,
      brand: product.brand || 'JJ Buys',
      stock: String(product.stock || 0),
    });
  };

  const handleDelete = (productId) => {
    onDeleteProduct(productId);
    setAlertMessage('Product deleted successfully.');
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-end gap-3 flex-wrap mb-4">
        <div>
          <p className="eyebrow mb-2">Dashboard</p>
          <h2 className="section-title mb-0">Admin overview</h2>
        </div>
        <div className="text-muted small">Signed in as {currentUser?.name || 'Guest'}</div>
      </div>

      {alertMessage ? (
        <div className="alert alert-success rounded-4 mb-4">{alertMessage}</div>
      ) : null}

      <Card className="border-0 shadow-sm p-3 mb-4">
        <h5 className="mb-3">Access details</h5>
        <div className="d-flex flex-wrap gap-3">
          <div className="border rounded-4 p-3">
            <div className="small text-muted">Admin</div>
            <div className="fw-semibold">mahmoud@gmail.com</div>
            <div className="small text-muted">Password: 12345678</div>
          </div>
          <div className="border rounded-4 p-3">
            <div className="small text-muted">Moderator</div>
            <div className="fw-semibold">moderator@gmail.com</div>
            <div className="small text-muted">Password: moderator123</div>
          </div>
          <div className="border rounded-4 p-3">
            <div className="small text-muted">Tester</div>
            <div className="fw-semibold">tester@gmail.com</div>
            <div className="small text-muted">Password: tester123</div>
          </div>
        </div>
      </Card>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {['products', 'carts', 'users', 'authentication'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'dark' : 'outline-dark'}
            className="rounded-pill px-3"
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="summary-card border-0 shadow-sm p-3 h-100">
            <div className="text-muted small">Products</div>
            <div className="display-6 fw-bold mt-2">{summary.productCount}</div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="summary-card border-0 shadow-sm p-3 h-100">
            <div className="text-muted small">Users</div>
            <div className="display-6 fw-bold mt-2">{summary.userCount}</div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="summary-card border-0 shadow-sm p-3 h-100">
            <div className="text-muted small">Carts</div>
            <div className="display-6 fw-bold mt-2">{carts.length}</div>
          </Card>
        </Col>
      </Row>

      {activeTab === 'products' ? (
        <Row className="g-4">
          <Col lg={5}>
            <Card className="border-0 shadow-sm p-3 h-100">
              <h4 className="mb-3">{editingId ? 'Edit product' : 'Add product'}</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Product name</Form.Label>
                  <Form.Control name="title" value={form.title} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category" value={form.category} onChange={handleChange}>
                    <option>Tech Essentials</option>
                    <option>Fashion Edit</option>
                    <option>Beauty &amp; Care</option>
                    <option>Home &amp; Living</option>
                    <option>Everyday Finds</option>
                    <option>Drive &amp; Travel</option>
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="number" name="price" value={form.price} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control type="number" name="stock" value={form.stock} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control name="brand" value={form.brand} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={handleChange} />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="dark" className="rounded-pill px-4">
                    {editingId ? 'Save changes' : 'Add product'}
                  </Button>
                  {editingId ? (
                    <Button
                      type="button"
                      variant="outline-dark"
                      className="rounded-pill px-4"
                      onClick={() => {
                        setEditingId(null);
                        setForm(defaultProductForm);
                      }}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </Form>
            </Card>
          </Col>

          <Col lg={7}>
            <Card className="border-0 shadow-sm p-3">
              <h4 className="mb-3">Products</h4>
              <div style={{ maxHeight: '420px', overflowY: 'auto' }} className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="fw-semibold">{product.name}</div>
                        </td>
                        <td>{product.category}</td>
                        <td>${Number(product.price).toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button size="sm" variant="outline-dark" onClick={() => handleEdit(product)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="outline-danger" onClick={() => handleDelete(product.id)}>
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
        </Row>
      ) : null}

      {activeTab === 'carts' ? (
        <Card className="border-0 shadow-sm p-3">
          <h4 className="mb-3">Carts</h4>
          <div className="d-grid gap-3">
            {(carts || []).map((cartItem) => (
              <div key={cartItem.id} className="border rounded-4 p-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                  <div className="fw-semibold">Cart #{cartItem.id}</div>
                  <span className="badge rounded-pill bg-light text-dark">{cartItem.products?.length || 0} items</span>
                </div>
                <div className="small text-muted mb-2">User ID: {cartItem.userId}</div>
                <div className="d-flex flex-wrap gap-2">
                  {(cartItem.products || []).map((product) => (
                    <span key={`${cartItem.id}-${product.id}`} className="badge rounded-pill bg-dark-subtle text-dark px-3 py-2">
                      {product.title || 'Product'} x {product.quantity}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {activeTab === 'users' ? (
        <Row className="g-4 mt-1">
          <Col lg={12}>
            <Card className="border-0 shadow-sm p-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h4 className="mb-0">Users Module</h4>
                <div className="d-flex gap-2 flex-wrap">
                  <Form.Control
                    size="sm"
                    type="text"
                    value={userSearch}
                    onChange={(event) => {
                      setUserSearch(event.target.value);
                      setUserPage(1);
                    }}
                    placeholder="Search users"
                    style={{ width: 180 }}
                  />
                  <Form.Select
                    size="sm"
                    value={userRoleFilter}
                    onChange={(event) => {
                      setUserRoleFilter(event.target.value);
                      setUserPage(1);
                    }}
                    style={{ width: 140 }}
                  >
                    {userRoleOptions.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </Form.Select>
                </div>
              </div>

              <Row className="g-3">
                <Col lg={7}>
                  <div className="d-grid gap-3">
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          className="text-start border rounded-4 p-3 bg-white w-100"
                          onClick={() => setSelectedUser(user)}
                          style={{ borderColor: selectedUser?.id === user.id ? '#0d6efd' : '#dee2e6' }}
                        >
                          <div className="d-flex justify-content-between align-items-center gap-3">
                            <div>
                              <div className="fw-semibold">
                                {user.firstName} {user.lastName}
                              </div>
                              <small className="text-muted">{user.email}</small>
                            </div>
                            <span className="badge rounded-pill bg-light text-dark">{user.role}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="border rounded-4 p-4 text-muted">No users match your search.</div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button
                      size="sm"
                      variant="outline-dark"
                      onClick={() => handleUserPageChange(userPage - 1)}
                      disabled={userPage === 1}
                    >
                      Previous
                    </Button>
                    <small className="text-muted">Page {userPage} of {userTotalPages}</small>
                    <Button
                      size="sm"
                      variant="outline-dark"
                      onClick={() => handleUserPageChange(userPage + 1)}
                      disabled={userPage >= userTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                </Col>

                <Col lg={5}>
                  <div className="border rounded-4 p-3 h-100 bg-light-subtle">
                    {selectedUser ? (
                      <>
                        <div className="fw-bold fs-5 mb-2">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </div>
                        <div className="mb-2"><strong>Email:</strong> {selectedUser.email}</div>
                        <div className="mb-2"><strong>Role:</strong> {selectedUser.role}</div>
                        <div className="mb-2"><strong>Phone:</strong> {selectedUser.phone}</div>
                        <div className="mb-2"><strong>Gender:</strong> {selectedUser.gender}</div>
                        <div className="mb-2"><strong>Company:</strong> {selectedUser.company}</div>
                      </>
                    ) : (
                      <div className="text-muted">Select a user to view the details.</div>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      ) : null}

      {activeTab === 'authentication' ? (
        <Card className="border-0 shadow-sm p-3">
          <h4 className="mb-3">Authentication</h4>
          <div className="d-grid gap-3">
            {authUsers.map((user) => (
              <div key={user.email} className="border rounded-4 p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <div className="fw-semibold">{user.name}</div>
                  <small className="text-muted">{user.email}</small>
                </div>
                <div className="d-flex gap-2 flex-wrap align-items-center">
                  <span className="badge rounded-pill bg-light text-dark">{user.role}</span>
                  <span className="small text-muted">Password: {user.password}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </Container>
  );
}

export default DashboardPage;
