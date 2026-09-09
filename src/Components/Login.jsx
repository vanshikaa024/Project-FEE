import { useState } from "react";
import {
  Package,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (onLogin) {
      onLogin({
        email,
        password,
        rememberMe,
      });
    }
  };

  return (
    <div className="smart-login-page">


      <div className="smart-bg-glow smart-glow-top"></div>
      <div className="smart-bg-glow smart-glow-bottom"></div>

      <div className="smart-top-left-arc"></div>

      <div className="smart-bottom-right-arc"></div>

      <div className="smart-grid"></div>


      <div className="smart-line smart-line-one"></div>
      <div className="smart-line smart-line-two"></div>
      <div className="smart-dot smart-dot-one"></div>
      <div className="smart-dot smart-dot-two"></div>
      <div className="smart-dot smart-dot-three"></div>

 

      <div className="smart-login-card">

        <div className="smart-login-logo">
          <div className="smart-logo-box">
            <Package size={30} strokeWidth={2.2} />
          </div>
        </div>


        <div className="smart-brand">
          <h1>SmartShelf</h1>
          <p>Inventory Management System</p>
        </div>

        <div className="smart-divider"></div>

        {/* Heading */}
        <div className="smart-login-heading">
          <p>Manage your inventory and track your stock.</p>
          <h2>Login to Your Account</h2>
        </div>

        <form className="smart-login-form" onSubmit={handleSubmit}>

  
          <div className="smart-input-group">
            <label>Email</label>

            <div className="smart-input-wrapper">
              <Mail size={17} />

              <input
                type="email"
                placeholder="Enter your Gmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="smart-input-group">
            <label>Password</label>

            <div className="smart-input-wrapper">
              <Lock size={17} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="smart-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </div>

          <div className="smart-login-options">

            <label className="smart-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />

              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="smart-forgot"
              onClick={() =>
                setError(
                  "Password recovery is not available in this version."
                )
              }
            >
              Forgot password?
            </button>

          </div>

          {error && (
            <div className="smart-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="smart-login-button"
          >
            <span>Login</span>
            <ArrowRight size={18} />
          </button>

        </form>

        <div className="smart-login-footer">

          <div className="smart-footer-line"></div>

          <p>
            SmartShelf <span>•</span> Inventory Management
          </p>

          <span>
            --Secure access to your inventory manager--
          </span>

        </div>

      </div>
    </div>
  );
}

export default Login;