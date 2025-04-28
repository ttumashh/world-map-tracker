import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.status === 200) {
        const { token, userId } = response.data;
  
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
  
        router.push('/');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Error during login');
    }
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Login</h2>

        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.inputLabel}>Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.inputField}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.inputLabel}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputField}
              required
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Login
          </button>
        </form>

        <div style={styles.signupLink}>
          <p>Don't have an account? <a href="/signup" style={styles.link}>Sign up here</a></p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'white',
  },
  formContainer: {
    backgroundColor: 'white', 
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputLabel: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '5px',
  },
  inputField: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease-in-out',
  },
  inputFieldFocus: {
    borderColor: '#ff66cc',
    outline: 'none',
    boxShadow: '0 0 5px rgba(255, 102, 204, 0.5)',
  },
  submitButton: {
    padding: '14px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  },
  submitButtonHover: {
    backgroundColor: '#0056b3',
  },
  signupLink: {
    textAlign: 'center',
    marginTop: '20px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  linkHover: {
    color: '#0056b3',
  },
};

export default Login;
