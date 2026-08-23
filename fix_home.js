const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Home.jsx', 'utf8');

// Add imports
if (!content.includes('AuthContext')) {
    content = content.replace(
        "import { Link } from 'react-router-dom';",
        "import { Link } from 'react-router-dom';\nimport { useContext } from 'react';\nimport { AuthContext } from '../context/AuthContext';"
    );
}

// Add useContext
if (!content.includes('useContext(AuthContext)')) {
    content = content.replace(
        "const Home = () => {",
        "const Home = () => {\n  const { user } = useContext(AuthContext);"
    );
}

// Replace buttons
const oldButtons = `<div className="hero-cta">
                <Link to="/register" className="btn-primary">Register Now</Link>
                <Link to="/login" className="btn-secondary">Login</Link>
              </div>`;

const newButtons = `<div className="hero-cta">
                {user ? (
                  <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary">Go to Dashboard</Link>
                ) : (
                  <>
                    <Link to="/register" className="btn-primary">Register Now</Link>
                    <Link to="/login" className="btn-secondary">Login</Link>
                  </>
                )}
              </div>`;

content = content.replace(oldButtons, newButtons);
fs.writeFileSync('client/src/pages/Home.jsx', content);
console.log("Done");
