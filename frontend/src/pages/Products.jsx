import React, { useEffect, useState } from "react";
import axios from "axios";
import "./products.css";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  // -----------------------------------
  // FETCH PRODUCTS
  // -----------------------------------

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://127.0.0.1:8000/api/products/"
      );

      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // FETCH CATEGORIES
  // -----------------------------------

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/products/categories/"
      );

      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // -----------------------------------
  // GET UNIQUE BRANDS
  // -----------------------------------

  const brands = [
    ...new Set(
      products
        .map((product) => product.brand)
        .filter(Boolean)
    ),
  ];

  // -----------------------------------
  // GET UNIQUE COLORS
  // -----------------------------------

  const colors = [
    ...new Set(
      products
        .flatMap(
          (product) =>
            product.variants?.map(
              (variant) => variant.color
            ) || []
        )
        .filter(Boolean)
    ),
  ];

  // -----------------------------------
  // CLEAR FILTERS
  // -----------------------------------

  const clearFilters = () => {
    setSelectedGender("");
    setSelectedCategory("");
    setSelectedColor("");
    setSelectedBrand("");
    setSelectedDiscount("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setSortBy("");
  };

  // -----------------------------------
  // FILTER PRODUCTS
  // -----------------------------------

  const filteredProducts = products
    .filter((product) => {

      // Gender
      if (
        selectedGender &&
        product.gender !== selectedGender
      ) {
        return false;
      }

      // Category
      if (
        selectedCategory &&
        String(product.category) !==
          String(selectedCategory)
      ) {
        return false;
      }

      // Brand
      if (
        selectedBrand &&
        product.brand?.toLowerCase() !==
          selectedBrand.toLowerCase()
      ) {
        return false;
      }

      // Color
      if (selectedColor) {
        const productColors =
          product.variants?.map(
            (variant) =>
              variant.color?.toLowerCase()
          ) || [];

        if (
          !productColors.includes(
            selectedColor.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // Minimum Price
      if (
        minPrice &&
        Number(product.price) <
          Number(minPrice)
      ) {
        return false;
      }

      // Maximum Price
      if (
        maxPrice &&
        Number(product.price) >
          Number(maxPrice)
      ) {
        return false;
      }

      // Discount
      if (
        selectedDiscount &&
        Number(product.discount_percent || 0) <
          Number(selectedDiscount)
      ) {
        return false;
      }

      // Search
      if (search) {
        const searchText =
          search.toLowerCase();

        const productName =
          product.name?.toLowerCase() || "";

        const productBrand =
          product.brand?.toLowerCase() || "";

        const categoryName =
          product.category_name?.toLowerCase() || "";

        if (
          !productName.includes(searchText) &&
          !productBrand.includes(searchText) &&
          !categoryName.includes(searchText)
        ) {
          return false;
        }
      }

      return true;
    })

    // -----------------------------------
    // SORT
    // -----------------------------------

    .sort((a, b) => {

      if (sortBy === "low") {
        return (
          Number(a.price) -
          Number(b.price)
        );
      }

      if (sortBy === "high") {
        return (
          Number(b.price) -
          Number(a.price)
        );
      }

      if (sortBy === "discount") {
        return (
          Number(b.discount_percent || 0) -
          Number(a.discount_percent || 0)
        );
      }

      if (sortBy === "newest") {
        return (
          new Date(b.created_at) -
          new Date(a.created_at)
        );
      }

      return 0;
    });

  return (
    <div className="products-page">

      {/* =================================
          HEADER
          ================================= */}

      <div className="products-header">

        <div>
          <h1>Products</h1>

          <p>
            Explore our latest collection
          </p>
        </div>

        <div className="products-actions">

          {/* SEARCH */}

          <div className="product-search">

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* SORT */}

          <div className="sort-wrapper">

            <label>
              Sort By
            </label>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="">
                Recommended
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>

              <option value="discount">
                Highest Discount
              </option>
            </select>

          </div>

        </div>
      </div>

      {/* =================================
          MAIN LAYOUT
          ================================= */}

      <div className="products-layout">

        {/* =================================
            SIDEBAR
            ================================= */}

        <aside className="products-sidebar">

          <div className="filter-heading">

            <h3>
              FILTERS
            </h3>

            <button
              onClick={clearFilters}
              className="clear-filter"
            >
              Clear All
            </button>

          </div>

          {/* GENDER */}

          <div className="filter-section">

            <h4>
              Gender
            </h4>

            {[
              ["men", "Men"],
              ["women", "Women"],
              ["kids", "Kids"],
            ].map(([value, label]) => (

              <label key={value}>

                <input
                  type="radio"
                  name="gender"
                  value={value}
                  checked={
                    selectedGender === value
                  }
                  onChange={(e) =>
                    setSelectedGender(
                      e.target.value
                    )
                  }
                />

                {label}

              </label>

            ))}

          </div>

          {/* CATEGORY */}

          <div className="filter-section">

            <h4>
              Categories
            </h4>

            {categories.map((category) => (

              <label key={category.id}>

                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={
                    String(selectedCategory) ===
                    String(category.id)
                  }
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value
                    )
                  }
                />

                {category.name}

              </label>

            ))}

          </div>

          {/* COLOR */}

          <div className="filter-section">

            <h4>
              Color
            </h4>

            {colors.map((color) => (

              <label key={color}>

                <input
                  type="radio"
                  name="color"
                  value={color}
                  checked={
                    selectedColor === color
                  }
                  onChange={(e) =>
                    setSelectedColor(
                      e.target.value
                    )
                  }
                />

                {color}

              </label>

            ))}

          </div>

          {/* BRAND */}

          <div className="filter-section">

            <h4>
              Brand
            </h4>

            {brands.map((brand) => (

              <label key={brand}>

                <input
                  type="radio"
                  name="brand"
                  value={brand}
                  checked={
                    selectedBrand === brand
                  }
                  onChange={(e) =>
                    setSelectedBrand(
                      e.target.value
                    )
                  }
                />

                {brand}

              </label>

            ))}

          </div>

          {/* PRICE */}

          <div className="filter-section">

            <h4>
              Price
            </h4>

            <div className="price-inputs">

              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(e.target.value)
                }
              />

              <span>—</span>

              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value)
                }
              />

            </div>

          </div>

          {/* DISCOUNT */}

          <div className="filter-section">

            <h4>
              Discount Range
            </h4>

            {[
              ["10", "10% and above"],
              ["20", "20% and above"],
              ["30", "30% and above"],
              ["40", "40% and above"],
              ["50", "50% and above"],
            ].map(([value, label]) => (

              <label key={value}>

                <input
                  type="radio"
                  name="discount"
                  value={value}
                  checked={
                    selectedDiscount === value
                  }
                  onChange={(e) =>
                    setSelectedDiscount(
                      e.target.value
                    )
                  }
                />

                {label}

              </label>

            ))}

          </div>

        </aside>

        {/* =================================
            PRODUCTS
            ================================= */}

        <main className="products-content">

          <div className="products-count">

            <span>
              {filteredProducts.length} Products
            </span>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="products-loading">
              Loading products...
            </div>

          ) : filteredProducts.length === 0 ? (

            <div className="no-products">

              <h3>
                No products found
              </h3>

              <p>
                Try changing your filters.
              </p>

            </div>

          ) : (

            <div className="products-grid">

              {filteredProducts.map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))}

            </div>

          )}

        </main>

      </div>

    </div>
  );
};

export default Products;
