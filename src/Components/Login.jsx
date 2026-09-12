import { useEffect, useState } from "react";
import {
  Package,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
} from "lucide-react";
import "./Login.css";

function Login({ onLogin, onSignUp }) {
  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Remember the email only. Passwords should be handled by the browser's
  // password manager / autofill rather than stored in localStorage.
  useEffect(() => {
    const savedEmail = localStorage.getItem("smartshelf_saved_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLogin = (e) => {
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

    if (rememberMe) {
      localStorage.setItem("smartshelf_saved_email", email);
    } else {
      localStorage.removeItem("smartshelf_saved_email");
    }

    if (onLogin) {
      onLogin({
        email,
        password,
        rememberMe,
      });
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (onSignUp) {
      onSignUp({
        name,
        email,
        password,
      });
      return;
    }

    // If no backend signup handler is connected yet, return to login
    // with the email pre-filled. Do not save the password in localStorage.
    setEmail(email);
    setPassword("");
    setConfirmPassword("");
    setName("");
    setMode("login");
    setError("Account details validated. You can now log in.");
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

        <div className="smart-login-heading">
          <p>Manage your inventory and track your stock.</p>
          <h2>
            {mode === "login" ? "Login to Your Account" : "Create Your Account"}
          </h2>
        </div>

        {mode === "login" ? (
          <form className="smart-login-form" onSubmit={handleLogin}>
            <div className="smart-input-group">
              <label>Email</label>
              <div className="smart-input-wrapper">
                <Mail size={17} />
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
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
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="smart-password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
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
                  setError("Password recovery is not available in this version.")
                }
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className={`smart-error ${error.includes("validated") ? "smart-success" : ""}`}>
                {error}
              </div>
            )}

            <button type="submit" className="smart-login-button">
              <span>Login</span>
              <ArrowRight size={18} />
            </button>

            <div className="smart-auth-switch">
              <span>Don't have an account?</span>
              <button type="button" onClick={() => switchMode("signup")}>
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          <form className="smart-login-form" onSubmit={handleSignUp}>
            <div className="smart-input-group">
              <label>Name</label>
              <div className="smart-input-wrapper">
                <User size={17} />
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="smart-input-group">
              <label>Email</label>
              <div className="smart-input-wrapper">
                <Mail size={17} />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
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
                  name="new-password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="smart-password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="smart-input-group">
              <label>Confirm Password</label>
              <div className="smart-input-wrapper">
                <Lock size={17} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm-password"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="smart-password-toggle"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                </button>
              </div>
            </div>

            {error && <div className="smart-error">{error}</div>}

            <button type="submit" className="smart-login-button">
              <span>Sign Up</span>
              <ArrowRight size={18} />
            </button>

            <div className="smart-auth-switch">
              <span>Already have an account?</span>
              <button type="button" onClick={() => switchMode("login")}>
                Login
              </button>
            </div>
          </form>
        )}

        <div className="smart-login-footer">
          <div className="smart-footer-line"></div>
          <p>
            SmartShelf <span>•</span> Inventory Management
          </p>
          <span>--Secure access to your inventory manager--</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
