import React from "react";
import heroImage from "../assets/hero.jpg";
import googleIcon from "../assets/googleicon.png";

export default function SignUpPage() {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Roboto', sans-serif;
        }

        body {
          background-color: #fff;
          color: #333;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          border-bottom: 1px solid #eee;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          width: 100%;
          background-color: #fff;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
        }

        nav a {
          margin: 0 10px;
          text-decoration: none;
          color: #333;
          font-size: 0.9rem;
        }

        .icons span {
          margin-left: 15px;
          font-size: 1rem;
        }

        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 50px;
          gap: 50px;
          margin-top: 150px;
          flex-wrap: wrap;
        }

        .signup-image img {
          width: 250px;
          height: 330px;
          border-radius: 8px;
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: 500px;
        }

        .signup-form h2 {
          font-size: 2rem;
        }

        .signup-form input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .signup-form button {
          padding: 10px;
          background-color: #3b2f2f;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .or {
          text-align: center;
          margin: 10px 0;
          color: #888;
        }

        .google-signup {
          background-color: white;
          color: #444;
          border: 1px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          border-radius: 4px;
        }

        .google-signup img {
          width: 20px;
          height: 20px;
        }

        footer {
          background-color: #3b2f2f;
          color: white;
          display: flex;
          justify-content: space-around;
          padding: 30px 50px;
          flex-wrap: wrap;
        }

        .footer-left,
        .footer-middle,
        .footer-contact,
        .footer-policies {
          flex: 1;
          margin: 10px;
        }

        .footer-logo {
          font-size: 1.3rem;
          font-weight: bold;
        }

        .social-icons span {
          margin-right: 10px;
        }

        footer a {
          color: #fff;
          text-decoration: none;
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .signup-container {
            flex-direction: column;
            padding: 20px;
          }

          .signup-form, .signup-image img {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>

      <header>
        <div className="logo">Smell</div>
        <nav>
          <a href="#">MEN</a>
          <a href="#">WOMEN</a>
          <a href="#">COUPLE</a>
          <a href="#">KIDS</a>
        </nav>
        <div className="icons">
          <span>♡</span>
          <span>👤</span>
          <span>🔍</span>
        </div>
      </header>

      <main className="signup-container">
        <div className="signup-image">
          <img src={heroImage} alt="Perfume with Leopard" />
        </div>
        <div className="signup-form">
          <h2>Create Your Account</h2>
          <input type="text" placeholder="First Name" />
          <input type="text" placeholder="Last Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Create Account</button>
          <div className="or">OR</div>
          <button className="google-signup">
            <img src={googleIcon} alt="Google" />
          </button>
        </div>
      </main>

      <footer>
        <div className="footer-left">
          <div className="footer-logo">Smell</div>
          <div className="social-icons">
            <span>📘</span>
            <span>📸</span>
          </div>
          <p><a href="#">Need Help? Click Here</a></p>
        </div>
        <div className="footer-middle">
          <h4>About Us</h4>
          <p>You are accessing the Titan Nepal brand website.</p>
          <p><a href="#">Store Locator</a></p>
        </div>
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Unit name - Nepal Trade Network Pvt Ltd. (NTN)</p>
          <p>Address: 1081, Durbar marg, Kathmandu, Bagmati, Nepal, 44600</p>
          <p>Email: info@ntn.com.np</p>
          <p>Ph no: 01-5331990</p>
        </div>
        <div className="footer-policies">
          <h4>Policies</h4>
          <p><a href="#">About Us</a></p>
          <p><a href="#">Shipping & Order Policy</a></p>
          <p><a href="#">Warranty Policy</a></p>
          <p><a href="#">Privacy Policy</a></p>
        </div>
      </footer>
    </>
  );
}
