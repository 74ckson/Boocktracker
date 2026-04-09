// ============================================================================
// pages/Login.jsx - Página de Login (Integrada com API)
// ============================================================================

import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      await login({ email: email.trim(), password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Container>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Card className="shadow-lg" style={{ maxWidth: '450px', width: '100%' }}>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <i className="bi bi-book-heart text-primary" style={{ fontSize: '3rem' }}></i>
                <h2 className="mt-2 mb-1">BookTracker</h2>
                <p className="text-muted">Faça login para continuar</p>
              </div>

              {error && (
                <Alert variant="danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-envelope me-1"></i>
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="bi bi-lock me-1"></i>
                    Senha
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Entrando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Entrar
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center">
                <p className="text-muted mb-0">
                  Não tem uma conta?{' '}
                  <Link to="/register" className="text-decoration-none">
                    Cadastre-se grátis
                  </Link>
                </p>
              </div>

              {/* Demo Account */}
              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted">
                  <strong>Conta Demo:</strong><br />
                  Email: demo@booktracker.com<br />
                  Senha: 123456
                </small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Login;
