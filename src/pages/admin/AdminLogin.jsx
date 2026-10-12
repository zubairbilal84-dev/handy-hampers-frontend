import React, { useState } from 'react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Aap yahan apna ID aur Password set kar sakte hain
  const ADMIN_EMAIL = 'admin@alisaifi.com';
  const ADMIN_PASS = 'Admin@6260';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASS) {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      onLoginSuccess();
    } else {
      setError('Invalid Admin Email or Password! Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '35px 30px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#1a1a1a', marginBottom: '8px' }}>Admin Portal</h2>
        <p style={{ textAlign: 'center', color: '#777', fontSize: '14px', marginBottom: '24px' }}>
          Enter credentials to access Handy Hampers panel
        </p>

        {error && (
          <div style={{
            backgroundColor: '#ffeef0',
            color: '#d32f2f',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#333' }}>
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@handyhampers.com"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#333' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#111827',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;