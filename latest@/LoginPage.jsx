import React from "react";
import heroImage from "../assets/hero2.jpg";
import googleIcon from "../assets/googleicon.png";

export default function LoginPage() {
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

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 50px;
          gap: 50px;
          margin-top: 150px;
          flex-wrap: wrap;
        }

        .login-image img {
          width: 250px;
          height: 330px;
          border-radius: 8px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: 500px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 25px;
          border-radius: 8px;
          background-color: #fff;
        }

        .login-form h2 {
          font-size: 2rem;
        }

        .login-form input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .forgot {
          font-size: 0.8rem;
          text-decoration: none;
          color: #555;
        }

        .login-form button {
          padding: 10px;
          background-color: #3b2f2f;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .login-form button:hover {
          opacity: 0.9;
          transform: scale(1.02);
          transition: all 0.3s ease;
        }

        .or {
          text-align: center;
          margin: 10px 0;
          color: #888;
        }

        .google-signin {
          background-color: white;
          color: #444;
          border: 1px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px;
          border-radius: 4px;
          font-weight: bold;
        }

        .google-signin img {
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
          .login-container {
            flex-direction: column;
            padding: 20px;
            gap: 20px;
          }

          .login-form, .login-image img {
            width: 100%;
            max-width: 350px;
          }

          header {
            flex-direction: column;
            padding: 15px 20px;
          }

          nav, .icons {
            margin-top: 10px;
          }

          footer {
            flex-direction: column;
            align-items: center;
            text-align: center;
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

      <main className="login-container">
        <div className="login-image">
          <img src={heroImage} alt="Perfume Bottle" />
        </div>
        <div className="login-form">
          <h2>LOGIN</h2>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <a href="#" className="forgot">Forgot your password?</a>
          <button>SIGN IN</button>
          <div className="or">OR</div>
          <button className="google-signin">
            <img src={googleIcon} alt="Google" />
            Sign in with Google
          </button>
          <p><a href="#">Create account</a></p>
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
