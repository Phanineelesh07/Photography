const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');

if (!content.includes('EyeOff')) {
  // 1. Add imports
  content = content.replace(
    "import { motion } from 'framer-motion';",
    "import { motion, AnimatePresence } from 'framer-motion';\nimport { Eye, EyeOff } from 'lucide-react';"
  );
  
  // 2. Add state
  content = content.replace(
    "const [loading, setLoading] = useState(false);",
    "const [loading, setLoading] = useState(false);\n  const [showPassword, setShowPassword] = useState(false);"
  );

  // 3. Replace password block
  const oldPasswordBlock = `<div className="form-group">
            <label>Password (for dashboard access)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password (min 6 chars)" minLength="6" required />
          </div>`;
          
  const newPasswordBlock = `<div className="form-group" style={{ position: 'relative' }}>
            <label>Password (for dashboard access)</label>
            <input 
              type={showPassword ? 'text' : 'password'} 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Create a password (min 6 chars)" 
              minLength="6" 
              required 
              style={{ paddingRight: '45px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '38px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={showPassword ? 'hide' : 'show'}
                  initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                  transition={{ duration: 0.15 }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>`;

  if (content.includes(oldPasswordBlock)) {
    content = content.replace(oldPasswordBlock, newPasswordBlock);
    fs.writeFileSync('client/src/pages/Register.jsx', content);
    console.log('Register.jsx updated');
  } else {
    console.log('Could not find password block in Register.jsx');
  }
} else {
  console.log('Already updated Register.jsx');
}
