
"use client";
import { useState } from "react";
import { addShop, addProduct, addSale } from "@/lib/firestore";

export default function Admin() {
  // State for form data
  const [shopData, setShopData] = useState({ name: "", address: "", phone: "", email: "" });
  const [productData, setProductData] = useState({ name: "", price: "", category: "", stock: "" });
  const [saleData, setSaleData] = useState({ product: "", quantity: "", totalPrice: "", date: "" });

  // Handle form changes
  const handleShopChange = (e) =>
    setShopData({ ...shopData, [e.target.name]: e.target.value });
  const handleProductChange = (e) =>
    setProductData({ ...productData, [e.target.name]: e.target.value });
  const handleSaleChange = (e) =>
    setSaleData({ ...saleData, [e.target.name]: e.target.value });

  // Handle form submissions
  const handleAddShop = () => {
    addShop(shopData);
    setShopData({ name: "", address: "", phone: "", email: "" });
  };

  const handleAddProduct = () => {
    addProduct(productData);
    setProductData({ name: "", price: "", category: "", stock: "" });
  };

  const handleAddSale = () => {
    addSale(saleData);
    setSaleData({ product: "", quantity: "", totalPrice: "", date: "" });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-10">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <div className="card bg-base-100 shadow-xl border border-gray-200">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Add Shop</h2>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Shop Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={shopData.name}
                onChange={handleShopChange}
                placeholder="Enter shop name"
                className="input input-bordered input-primary w-full"
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Address</span>
              </label>
              <input
                type="text"
                name="address"
                value={shopData.address}
                onChange={handleShopChange}
                placeholder="Enter address"
                className="input input-bordered input-primary w-full"
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Phone</span>
              </label>
              <input
                type="text"
                name="phone"
                value={shopData.phone}
                onChange={handleShopChange}
                placeholder="Enter phone number"
                className="input input-bordered input-primary w-full"
              />
            </div>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={shopData.email}
                onChange={handleShopChange}
                placeholder="Enter email"
                className="input input-bordered input-primary w-full"
              />
            </div>
            <button onClick={handleAddShop} className="btn btn-primary w-full">
              Add Shop
            </button>
          </div>
        </div>

       
        <div className="card bg-base-100 shadow-xl border border-gray-200">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Add Product</h2>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Product Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleProductChange}
                placeholder="Enter product name"
                className="input input-bordered input-secondary w-full"
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Price</span>
              </label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleProductChange}
                placeholder="Enter price"
                className="input input-bordered input-secondary w-full"
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Category</span>
              </label>
              <input
                type="text"
                name="category"
                value={productData.category}
                onChange={handleProductChange}
                placeholder="Enter category"
                className="input input-bordered input-secondary w-full"
              />
            </div>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium">Stock</span>
              </label>
              <input
                type="number"
                name="stock"
                value={productData.stock}
                onChange={handleProductChange}
                placeholder="Enter stock quantity"
                className="input input-bordered input-secondary w-full"
              />
            </div>
            <button onClick={handleAddProduct} className="btn btn-secondary w-full">
              Add Product
            </button>
          </div>
        </div>

        
        <div className="card bg-base-100 shadow-xl border border-gray-200 md:col-span-2">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Add Sale</h2>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Product</span>
              </label>
              <input
                type="text"
                name="product"
                value={saleData.product}
                onChange={handleSaleChange}
                placeholder="Enter product name"
                className="input input-bordered input-accent w-full"
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Quantity</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={saleData.quantity}
                onChange={handleSaleChange}
                placeholder="Enter quantity"
                className="input input-bordered input-accent w-full"
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Total Price</span>
              </label>
              <input
                type="number"
                name="totalPrice"
                value={saleData.totalPrice}
                onChange={handleSaleChange}
                placeholder="Enter total price"
                className="input input-bordered input-accent w-full"
              />
            </div>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium">Date</span>
              </label>
              <input
                type="date"
                name="date"
                value={saleData.date}
                onChange={handleSaleChange}
                className="input input-bordered input-accent w-full"
              />
            </div>
            <button onClick={handleAddSale} className="btn btn-accent w-full">
              Add Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



