import React from "react";

const products = [
  {
    id: 1,
    img: "images/img1.jpg",
    alt: "Perfume 1",
    name: "Skinn By Titan Steele 20 ML Perfume For Men EDP",
    price: "1,065.00 NPR",
  },
  {
    id: 2,
    img: "images/img2.jpg",
    alt: "Perfume 2",
    name: "Skinn Nude 20 ML Perfume For Women EDP",
    price: "1,065.00 NPR",
  },
  {
    id: 3,
    img: "images/img3.jpg",
    alt: "Perfume 3",
    name: "Skinn by Titan Verge 20 ML Perfume for Men EDP",
    price: "1,065.00 NPR",
  },
  {
    id: 4,
    img: "images/img4.jpg",
    alt: "Perfume 4",
    name: "Skinn By Titan Celeste 20 ML Perfume For Woman",
    price: "1,065.00 NPR",
  },
  {
    id: 5,
    img: "images/img5.jpg",
    alt: "Perfume 5",
    name: "Skinn by Titan Sheer 20 ML Perfume for Women EDP",
    price: "1,065.00 NPR",
  },
];

const styles = {
  global: {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#fff",
    color: "#333",
    fontSize: "16px",
  },
  topBanner: {
    backgroundColor: "#000",
    color: "#fff",
    textAlign: "center",
    padding: "12px",
    fontSize: "0.95rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "30px 100px",
    borderBottom: "1px solid #ccc",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 10,
  },
  logo: {
    fontSize: "2.2rem",
    fontWeight: "bold",
  },
  nav: {
    display: "flex",
    gap: "20px",
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
    fontSize: "1rem",
    cursor: "pointer",
  },
  navLinkHover: {
    color: "#ff5e5e",
  },
  icons: {
    display: "flex",
    gap: "20px",
    fontSize: "1.3rem",
    cursor: "pointer",
  },
  mainContainer: {
    display: "flex",
    padding: "60px 100px",
    maxWidth: "1600px",
    margin: "0 auto",
    gap: "60px",
  },
  sidebar: {
    width: "300px",
    background: "#f5f5f5",
    padding: "30px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },
  sidebarHeader: {
    marginBottom: "25px",
    fontSize: "1.1rem",
  },
  clear: {
    float: "right",
    fontSize: "0.9rem",
    color: "red",
    cursor: "pointer",
  },
  filterSection: {
    marginBottom: "30px",
  },
  inputRange: {
    width: "100%",
  },
  productListing: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "40px",
    flexGrow: 1,
  },
  productCard: {
    background: "#fff",
    border: "1px solid #ccc",
    padding: "20px",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow: "0 5px 10px rgba(0,0,0,0.05)",
    transition: "transform 0.3s ease",
    cursor: "default",
  },
  productCardHover: {
    transform: "translateY(-5px)",
  },
  productImg: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    marginBottom: "15px",
    objectFit: "cover",
  },
  productName: {
    marginBottom: "5px",
    fontSize: "1rem",
  },
  productPrice: {
    fontWeight: "700",
    color: "#ff5e5e",
    marginBottom: "10px",
  },
  quickView: {
    color: "#666",
    fontSize: "0.9rem",
    display: "inline-block",
    marginTop: "5px",
    cursor: "pointer",
  },
  quickViewHover: {
    color: "#ff5e5e",
    textDecoration: "underline",
  },
};

export default function SmellStore() {
 
  const [hoveredProduct, setHoveredProduct] = React.useState(null);
  const [hoveredQuickView, setHoveredQuickView] = React.useState(null);

  return (
    <div style={styles.global}>
      <div style={styles.topBanner}>
        Official Website &nbsp; | &nbsp; 2 Years Warranty | Free Shipping | 100%
        Authentic Product
      </div>

      <header style={styles.header}>
        <div style={styles.logo}>Smell</div>
        <nav style={styles.nav}>
          {["MEN", "WOMEN", "COUPLE", "KIDS"].map((category) => (
            <a
              key={category}
              href="#"
              style={styles.navLink}
              onMouseEnter={(e) => (e.target.style.color = "#ff5e5e")}
              onMouseLeave={(e) => (e.target.style.color = "#333")}
            >
              {category}
            </a>
          ))}
        </nav>
        <div style={styles.icons}>
          <span>♡</span>
          <span>👤</span>
          <span>🔍</span>
        </div>
      </header>

      <main style={styles.mainContainer}>
        <aside style={styles.sidebar}>
          <h4 style={styles.sidebarHeader}>
            FILTER BY <span style={styles.clear}>CLEAR ALL</span>
          </h4>
          <div style={styles.filterSection}>
            <label>PRICE</label>
            <input type="range" min="0" max="2250" style={styles.inputRange} />
            <p>0 NPR – 2250 NPR</p>
          </div>
          <div style={styles.filterSection}>
            <details>
              <summary>Gender</summary>
            </details>
            <details>
              <summary>Product Category</summary>
            </details>
            <details>
              <summary>Availability</summary>
            </details>
          </div>
        </aside>

        <section style={styles.productListing}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                ...styles.productCard,
                ...(hoveredProduct === product.id
                  ? { transform: "translateY(-5px)" }
                  : {}),
              }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <img
                src={product.img}
                alt={product.alt}
                style={styles.productImg}
              />
              <p style={styles.productName}>{product.name}</p>
              <p style={styles.productPrice}>{product.price}</p>
              <span
                style={{
                  ...styles.quickView,
                  ...(hoveredQuickView === product.id
                    ? styles.quickViewHover
                    : {}),
                }}
                onMouseEnter={() => setHoveredQuickView(product.id)}
                onMouseLeave={() => setHoveredQuickView(null)}
              >
                Quick View
              </span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
