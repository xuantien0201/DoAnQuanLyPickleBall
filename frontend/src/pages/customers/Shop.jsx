import { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import '../../css/Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    sort: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    status: ''
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters, location.search]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = {
        sort: filters.sort,
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.status && filters.status !== 'all' && { status: filters.status })
      };

      const response = await axios.get('/api/products', { params });
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const handleCategoryChange = (category) => {
    setFilters({ ...filters, category });
    if (category) {
      searchParams.set('category', category);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleStatusChange = (status) => {
    setFilters({ ...filters, status });
    if (status && status !== 'all') {
      searchParams.set('status', status);
    } else {
      searchParams.delete('status');
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort: e.target.value });
  };

  const handlePriceFilter = () => {
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      sort: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      status: ''
    });
    searchParams.delete('category');
    searchParams.delete('search');
    searchParams.delete('status'); // Xóa status khỏi URL
    setSearchParams(searchParams);
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="container">
          <h1>Shop Page</h1>
          <p>Let's design the place you always imagined.</p>
        </div>
      </div>

      <div className="shop-content">
        <div className="container">
          <div className="shop-layout">
            {/* Sidebar Filters */}
            <aside className="shop-sidebar">
              <div className="filter-section">
                <h3>Categories</h3>
                <div className="filter-options">
                  <label className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === ''}
                      onChange={() => handleCategoryChange('')}
                    />
                    <span>All Products</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category.slug}
                        onChange={() => handleCategoryChange(category.slug)}
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="filter-section">
                <h3>Price</h3>
                <div className="price-filter">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                  <button onClick={handlePriceFilter} className="btn-apply">Apply</button>
                </div>
              </div>
              {/* Thêm bộ lọc trạng thái sản phẩm */}
              <div className="filter-section">
                <h3>Product Type</h3>
                <div className="filter-options">
                  <label className="filter-option">
                    <input
                      type="radio"
                      name="status"
                      value="all"
                      checked={filters.status === 'all'}
                      onChange={() => handleStatusChange('all')}
                    />
                    <span>All Products</span>
                  </label>
                  <label className="filter-option">
                    <input
                      type="radio"
                      name="status"
                      value="new"
                      checked={filters.status === 'new'}
                      onChange={() => handleStatusChange('new')}
                    />
                    <span>New Arrivals</span>
                  </label>
                  <label className="filter-option">
                    <input
                      type="radio"
                      name="status"
                      value="sale"
                      checked={filters.status === 'sale'}
                      onChange={() => handleStatusChange('sale')}
                    />
                    <span>On Sale</span>
                  </label>
                </div>
              </div>

              <button onClick={clearFilters} className="btn-clear">Clear Filters</button>
            </aside>

            {/* Products Grid */}
            <div className="shop-main">
              <div className="shop-controls">
                <div className="results-info">
                  <span>{products.length} Products</span>
                </div>

                <div className="sort-controls">
                  <label>Sort by:</label>
                  <select value={filters.sort} onChange={handleSortChange}>
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                  </select>
                </div>

                <div className="view-controls">
                  <button className="view-btn active">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                  </button>
                  <button className="view-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="3" y="3" width="18" height="4" />
                      <rect x="3" y="10" width="18" height="4" />
                      <rect x="3" y="17" width="18" height="4" />
                    </svg>
                  </button>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="no-products">
                  <p>No products found matching your criteria.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {products.length > 12 && (
                <div className="load-more">
                  <button className="btn btn-outline">Show More</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
