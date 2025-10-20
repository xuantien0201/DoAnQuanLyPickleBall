import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import '../../css/Shop.css';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [productStatus, setProductStatus] = useState(searchParams.get('status') || 'all'); // State cho bộ lọc trạng thái


  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, searchQuery, productStatus]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = {
        sort: sortBy,
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
        ...(priceRange.min && { minPrice: priceRange.min }),
        ...(priceRange.max && { maxPrice: priceRange.max }),
        ...(productStatus !== 'all' && { status: productStatus }) // Thêm param status nếu không phải 'all'

      };

      const response = await axios.get('/api/products', { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category) {
      searchParams.set('category', category);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleStatusChange = (status) => {
    setProductStatus(status);
    if (status && status !== 'all') {
      searchParams.set('status', status);
    } else {
      searchParams.delete('status');
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    if (searchInput) {
      searchParams.set('search', searchInput);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handlePriceFilter = () => {
    fetchProducts();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSortBy('newest');
    setPriceRange({ min: '', max: '' });
    setSearchInput('');
    setSearchQuery('');
    setProductStatus('all'); // Reset cả bộ lọc trạng thái
    searchParams.delete('category');
    searchParams.delete('search');
    searchParams.delete('status'); // Xóa status khỏi URL
    setSearchParams(searchParams);
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="container">
          <h1>Chào mừng đến với Cửa Hàng</h1>
          <p>Tìm kiếm mọi thứ bạn cần cho bộ môn Pickleball tại đây.</p>
        </div>
      </div>

      <div className="shop-content">
        <div className="container">
          <div className="shop-layout">
            {/* Sidebar Filters */}
            <aside className="shop-sidebar">
              <div className="filter-section">
                <h3>Tìm kiếm</h3>
                <form className="search-filter" onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button type="submit" className="btn-apply">Tìm kiếm</button>
                </form>
              </div>
              <div className="filter-section">
                <h3>Danh mục</h3>
                <ul className="category-filter-list">
                  <li
                    className={`category-item ${selectedCategory === '' ? 'active' : ''}`}
                    onClick={() => handleCategoryChange('')}
                  >
                    Tất cả sản phẩm
                  </li>
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className={`category-item ${selectedCategory === category.slug ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(category.slug)}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div className="filter-section">
                <h3>Giá</h3>
                <div className="price-filter">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  />
                  <button onClick={handlePriceFilter} className="btn-apply">Apply</button>
                </div>
              </div>
              {/* Thêm bộ lọc trạng thái sản phẩm */}
              <div className="filter-section">
                <h3>Loại sản phẩm</h3>
                <div className="filter-options">
                  <label className="filter-option">
                    <input
                      type="radio"
                      name="status"
                      value="new"
                      checked={productStatus === 'new'}
                      onChange={() => handleStatusChange('new')}
                    />
                    <span>Sản phẩm mới</span>
                  </label>
                  <label className="filter-option">
                    <input
                      type="radio"
                      name="status"
                      value="sale"
                      checked={productStatus === 'sale'}
                      onChange={() => handleStatusChange('sale')}
                    />
                    <span>Sản phẩm đang giảm giá</span>
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
                  <label>Lọc theo:</label>
                  <select value={sortBy} onChange={handleSortChange}>
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá: Từ Thấp đến Cao</option>
                    <option value="price_desc">Giá: Từ Cao đến Thấp</option>
                    <option value="name_asc">Tên: A to Z</option>
                    <option value="name_desc">Tên: Z to A</option>
                  </select>
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
