import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });
  const [editId, setEditId] = useState(null);

  const apiURL = 'https://product-inventory-q405.onrender.com/products';

  // Fetch products from JSON server
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(apiURL);
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add or Update product
  const handleSave = async () => {
    if (editId) {
      // Edit product
      const response = await axios.put(`${apiURL}/${editId}`, formData);
      const updatedProducts = products.map((product) =>
        product.id === editId ? response.data : product
      );
      setProducts(updatedProducts);
    } else {
      // Add product
      const response = await axios.post(apiURL, formData);
      setProducts([...products, response.data]);
    }
    handleClear();
  };

  // Edit product
  const handleEdit = (product) => {
    setEditId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
    });
  };

  // Delete product
  const handleDelete = async (id) => {
    await axios.delete(`${apiURL}/${id}`);
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleClear = () => {
    setEditId(null);
    setFormData({ name: '', category: '', price: '', stock: '', description: '' });
  };
  

  return (
    <>
      <div className="container mt-5">
        <h2>Product Inventory</h2>
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock Quantity</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.description}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className="btn btn-primary ms-2"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{editId ? 'Edit Inventory' : 'Add Inventory'}</Card.Title>
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              className="form-control mt-2"
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
            />
            <input
              className="form-control mt-2"
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
            />
            <input
              className="form-control mt-2"
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
            />
            <input className="form-control mt-2" type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange}/>
            <Button className="mt-4" variant="primary" onClick={handleSave}>
              {editId ? 'Update' : 'Add'}
            </Button>
            <Button className="ms-2 mt-4" variant="danger" onClick={handleClear}>
              Clear
            </Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default App;
