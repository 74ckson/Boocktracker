// ============================================================================
// pages/Register.jsx - Página de Registro (Integrada com API)
// ============================================================================

import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password
      });
      
      // Registro bem-sucedido, redirecionar para dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta. Tente novamente.');
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
                <h2 className="mt-2 mb-1">Criar Conta</h2>
                <p className="text-muted">Comece a acompanhar sua leitura</p>
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
                    <i className="bi bi-person me-1"></i>
                    Nome
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </Form.Group>

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

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-lock me-1"></i>
                    Senha
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="bi bi-lock-fill me-1"></i>
                    Confirmar Senha
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Criando conta...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Criar Conta Grátis
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center">
                <p className="text-muted mb-0">
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-decoration-none">
                    Fazer login
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Register;
