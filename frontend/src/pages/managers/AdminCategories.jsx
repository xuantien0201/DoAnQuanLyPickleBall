import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/AdminCategories.css';
import { Sidebar } from '../../components/Sidebar'; // Đảm bảo import Sidebar

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: '',
    slug: '',
    image_url: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/customers/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: value,
      ...(name === 'name' && { slug: value.toLowerCase().replace(/\s+/g, '-') })
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setCurrentCategory({ id: null, name: '', slug: '', image_url: '' });
    setImageFile(null);
    setImagePreview('');
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditMode(true);
    setCurrentCategory(category);
    setImageFile(null);
    setImagePreview(category.image_url || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentCategory({ id: null, name: '', slug: '', image_url: '' });
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', currentCategory.name);
    formData.append('slug', currentCategory.slug);
    
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (editMode) {
      formData.append('image_url', currentCategory.image_url || '');
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (editMode) {
        await axios.put(`/api/admin/categories/${currentCategory.id}`, formData, config);
        alert('Category updated successfully!');
      } else {
        await axios.post('/api/admin/categories', formData, config);
        alert('Category added successfully!');
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`/api/admin/categories/${id}`);
        alert('Category deleted successfully!');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category.');
      }
    }
  };

  // Bọc nội dung component trong một layout chung với Sidebar
  return (
    <div className="admin-container"> {/* Thêm container chung */}
      <Sidebar /> {/* Thêm Sidebar vào đây */}
      
      {/* Đây là nội dung gốc của trang AdminCategories */}
      <div className="admin-content">
        <div className="admin-categories-header">
          <h2>Category Management</h2>
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add New Category
          </button>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-image">
                {category.image_url ? (
                  <img src={category.image_url} alt={category.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p className="category-slug">/{category.slug}</p>
                <div className="category-actions">
                  <button className="btn-edit" onClick={() => openEditModal(category)}>
                    ✏️ Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(category.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content category-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editMode ? 'Edit Category' : 'Add New Category'}</h3>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>

              <form onSubmit={handleSubmit} className="category-form">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={currentCategory.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Paddles"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={currentCategory.slug}
                    onChange={handleInputChange}
                    placeholder="e.g., paddles"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    onChange={handleFileChange}
                  />
                </div>

                {imagePreview && (
                  <div className="image-preview">
                    <label>Preview:</label>
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Update Category' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;