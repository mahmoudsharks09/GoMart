import { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Topbar from './Topbar';
import CategoryPage from './CategoryPage';
import ProductDetailPage from './ProductDetailPage';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import ProductsPage from './ProductsPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import DashboardPage from './DashboardPage';
import { adminCredentials, moderatorCredentials, testerCredentials } from '../data/authUsers';

const PRODUCT_API_URL = 'https://dummyjson.com/products?limit=30';
const USERS_API_URL = 'https://dummyjson.com/users?limit=12';
const CARTS_API_URL = 'https://dummyjson.com/carts?limit=10';
const AUTH_STORAGE_KEY = 'jjbuys-auth-token';
const USER_STORAGE_KEY = 'jjbuys-user';

const categoryMeta = {
  'Tech Essentials': {
    icon: 'bi bi-laptop',
    color: '#dbeafe',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  },
  'Fashion Edit': {
    icon: 'bi bi-bag-heart',
    color: '#fce7f3',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  },
  'Beauty & Care': {
    icon: 'bi bi-flower2',
    color: '#dcfce7',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  },
  'Home & Living': {
    icon: 'bi bi-house-door',
    color: '#fef3c7',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  'Everyday Finds': {
    icon: 'bi bi-basket2',
    color: '#e0e7ff',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
  },
  'Drive & Travel': {
    icon: 'bi bi-car-front',
    color: '#fee2e2',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
  },
};

const normalizeCategory = (value) => {
  const normalized = String(value || '').toLowerCase();

  if (['smartphones', 'laptops', 'tablets', 'headphones', 'smartwatch', 'electronics', 'audio'].includes(normalized)) {
    return 'Tech Essentials';
  }

  if (['mens-shirts', 'mens-shoes', 'womens-dresses', 'womens-bags', 'womens-jewellery', 'tops', 'sunglasses', 'watches', 'fashion', 'women-shoes', 'mens-watches'].includes(normalized)) {
    return 'Fashion Edit';
  }

  if (['fragrances', 'skincare', 'beauty', 'makeup'].includes(normalized)) {
    return 'Beauty & Care';
  }

  if (['home-decoration', 'furniture', 'lighting', 'decor'].includes(normalized)) {
    return 'Home & Living';
  }

  if (['groceries', 'kitchen', 'kitchenware', 'food', 'essentials'].includes(normalized)) {
    return 'Everyday Finds';
  }

  if (['automotive', 'motorcycle', 'travel'].includes(normalized)) {
    return 'Drive & Travel';
  }

  return 'Everyday Finds';
};

const mapDummyProduct = (product) => {
  const category = normalizeCategory(product.category);
  const salePrice = Number(product.price || 0);
  const originalPrice = Math.round(salePrice * (1 + (Number(product.discountPercentage || 10) / 100)));

  return {
    id: product.id,
    name: product.title,
    category,
    price: salePrice,
    originalPrice,
    rating: Number(product.rating || 4.5),
    reviewCount: product.stock || 120,
    badge: Number(product.discountPercentage || 0) > 0 ? 'Hot Deal' : 'New',
    colors: ['Classic', 'Neutral', 'Premium'],
    image: product.thumbnail || product.images?.[0],
    gallery: product.images?.length ? product.images : [product.thumbnail || product.images?.[0]],
    description: product.description,
    features: [
      `${product.brand || 'Premium'} quality`,
      `In stock: ${product.stock || 0}`,
      `Rating ${product.rating || 4.5}/5`,
    ],
    stock: product.stock,
  };
};

const initialCart = [];

function StorefrontApp() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState(initialCart);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [authToken, setAuthToken] = useState(() => localStorage.getItem(AUTH_STORAGE_KEY) || '');
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (authToken) {
      localStorage.setItem(AUTH_STORAGE_KEY, authToken);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [authToken]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(PRODUCT_API_URL);
      if (!response.ok) {
        throw new Error('Unable to load products');
      }

      const data = await response.json();
      const mappedProducts = (data.products || []).map(mapDummyProduct);
      setProducts(mappedProducts);
      setError('');
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(USERS_API_URL);
      if (!response.ok) {
        throw new Error('Unable to load users');
      }
      const data = await response.json();
      setUsers((data.users || []).slice(0, 12));
    } catch (fetchError) {
      setUsers([]);
    }
  };

  const loadCarts = async () => {
    try {
      const response = await fetch(CARTS_API_URL);
      if (!response.ok) {
        throw new Error('Unable to load carts');
      }
      const data = await response.json();
      setCarts((data.carts || []).slice(0, 10));
    } catch (fetchError) {
      setCarts([]);
    }
  };

  useEffect(() => {
    loadProducts();
    loadUsers();
    loadCarts();
  }, []);

  const categoryOptions = ['All', ...new Set(products.map((product) => product.category))];

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const searchMatch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  const groupedCollections = categoryOptions
    .filter((category) => category !== 'All')
    .map((category) => {
      const items = filteredProducts.filter((product) => product.category === category).slice(0, 3);
      return { category, items };
    })
    .filter((group) => group.items.length > 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalCartValue = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const found = prevCart.find((item) => item.id === product.id);
      if (found) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prevCart, { id: product.id, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handlePlaceOrder = () => {
    setCart([]);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '').trim();

    if (!email || !password) {
      setAuthError('Please enter your email and password.');
      return;
    }

    try {
      setAuthError('');

      const normalizedEmail = email.toLowerCase();
      const isAdminLogin =
        normalizedEmail === adminCredentials.email.toLowerCase() && password === adminCredentials.password;
      const isModeratorLogin =
        normalizedEmail === moderatorCredentials.email.toLowerCase() && password === moderatorCredentials.password;
      const isTesterLogin =
        normalizedEmail === testerCredentials.email.toLowerCase() && password === testerCredentials.password;

      if (authMode === 'signup') {
        const response = await fetch('https://dummyjson.com/users/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: name.split(' ')[0] || 'New',
            lastName: name.split(' ').slice(1).join(' ') || 'Member',
            username: email.split('@')[0],
            email,
            password,
            role: 'Customer',
          }),
        });

        if (!response.ok) {
          throw new Error('Unable to create account.');
        }

        const account = await response.json();
        setCurrentUser({
          name: name || `${account.firstName || 'New'} ${account.lastName || 'Member'}`.trim(),
          email: account.email || email,
          role: 'Customer',
        });
        setAuthToken('signup-token');
        window.location.hash = '#/';
        return;
      }

      if (isAdminLogin) {
        const adminUser = {
          name: 'Mahmoud Admin',
          email: normalizedEmail,
          role: 'Admin',
        };

        setCurrentUser(adminUser);
        setAuthToken('admin-token');
        window.location.hash = '#/';
        return;
      }

      if (isModeratorLogin) {
        const moderatorUser = {
          name: 'Moderator User',
          email: normalizedEmail,
          role: 'Moderator',
        };

        setCurrentUser(moderatorUser);
        setAuthToken('moderator-token');
        window.location.hash = '#/';
        return;
      }

      if (isTesterLogin) {
        const testerUser = {
          name: 'Tester User',
          email: normalizedEmail,
          role: 'Tester',
        };

        setCurrentUser(testerUser);
        setAuthToken('tester-token');
        window.location.hash = '#/';
        return;
      }

      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email.includes('@') ? email.split('@')[0] : email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Incorrect email or password.');
      }

      const result = await response.json();
      const token = result.token;
      const userResponse = await fetch('https://dummyjson.com/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userPayload = userResponse.ok ? await userResponse.json() : null;

      const nextUser = {
        name: userPayload?.firstName
          ? `${userPayload.firstName} ${userPayload.lastName || ''}`.trim()
          : email.split('@')[0],
        email: userPayload?.email || email,
        role: userPayload?.role || 'Customer',
      };

      setCurrentUser(nextUser);
      setAuthToken(token);
      window.location.hash = '#/';
    } catch (fetchError) {
      setAuthError(fetchError.message || 'Authentication failed.');
      setCurrentUser(null);
      setAuthToken('');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken('');
    window.location.hash = '#/';
  };

  const handleAddProduct = async (payload) => {
    try {
      const response = await fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Unable to add product.');
      }

      const createdProduct = await response.json();
      const mappedProduct = mapDummyProduct(createdProduct);
      setProducts((prev) => [mappedProduct, ...prev]);
      setError('');
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to add product.');
    }
  };

  const handleUpdateProduct = async (productId, payload) => {
    try {
      const response = await fetch(`https://dummyjson.com/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Unable to edit product.');
      }

      const updatedProduct = await response.json();
      const mappedUpdatedProduct = mapDummyProduct(updatedProduct);
      setProducts((prev) => prev.map((item) => (item.id === productId ? mappedUpdatedProduct : item)));
      setError('');
    } catch (fetchError) {
      setProducts((prev) => prev.map((item) => {
        if (item.id !== productId) return item;

        const normalizedPayload = {
          ...item,
          name: payload.title || item.name,
          category: payload.category || item.category,
          price: Number(payload.price || item.price),
          originalPrice: Number(payload.price || item.price),
          description: payload.description || item.description,
          stock: Number(payload.stock || item.stock),
        };

        return normalizedPayload;
      }));
      setError(fetchError.message || 'Unable to edit product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`https://dummyjson.com/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Unable to delete product.');
      }

      const deletedProduct = await response.json();
      const deletedId = deletedProduct?.id ?? productId;
      setProducts((prev) => prev.filter((item) => item.id !== deletedId));
      setError('');
    } catch (fetchError) {
      setProducts((prev) => prev.filter((item) => item.id !== productId));
      setError(fetchError.message || 'Unable to delete product.');
    }
  };

  const handleCreateCart = async () => {
    try {
      const sampleProduct = products[0];
      const response = await fetch('https://dummyjson.com/carts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          products: sampleProduct ? [{ id: sampleProduct.id, quantity: 1 }] : [],
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to add cart.');
      }

      const createdCart = await response.json();
      setCarts((prev) => [createdCart, ...prev]);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to add cart.');
    }
  };

  return (
    <HashRouter>
      <div className="app-shell">
        <Topbar
          cartCount={cartCount}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <Routes>
          <Route path="/" element={
            <HomePage
              categoryOptions={categoryOptions}
              filteredProducts={filteredProducts}
              groupedCollections={groupedCollections}
              loading={loading}
              error={error}
              addToCart={addToCart}
              setSelectedCategory={setSelectedCategory}
              categoryMeta={categoryMeta}
            />
          } />

          <Route path="/categories" element={
            <CategoryPage
              categoryOptions={categoryOptions.filter((category) => category !== 'All')}
              productCountByCategory={categoryOptions
                .filter((category) => category !== 'All')
                .reduce((acc, category) => {
                  acc[category] = products.filter((product) => product.category === category).length;
                  return acc;
                }, {})}
              onSelectCategory={(category) => {
                setSelectedCategory(category);
                window.location.hash = '#/products';
              }}
              categoryMeta={categoryMeta}
            />
          } />

          <Route path="/products" element={
            <ProductsPage
              categoryOptions={categoryOptions}
              filteredProducts={filteredProducts}
              loading={loading}
              error={error}
              addToCart={addToCart}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          } />

          <Route path="/products/:productId" element={<ProductDetailPage products={products} onAddToCart={addToCart} />} />

          <Route path="/cart" element={
            <CartPage
              cart={cart}
              products={products}
              updateCartQuantity={updateCartQuantity}
              removeFromCart={removeFromCart}
              totalCartValue={totalCartValue}
            />
          } />

          <Route path="/checkout" element={
            <CheckoutPage
              cart={cart}
              products={products}
              totalCartValue={totalCartValue}
              onPlaceOrder={handlePlaceOrder}
              currentUser={currentUser}
            />
          } />

          <Route path="/login" element={
            <AuthPage
              authMode={authMode}
              setAuthMode={setAuthMode}
              onSubmit={handleAuthSubmit}
              authError={authError}
            />
          } />

          <Route path="/dashboard" element={
            currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Moderator') ? (
              <DashboardPage
                products={products}
                users={users}
                carts={carts}
                currentUser={currentUser}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onCreateCart={handleCreateCart}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default StorefrontApp;
