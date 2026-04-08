# 📚 BookTracker

Um aplicativo web para acompanhar seus livros e hábitos de leitura, construído com **React** e **Bootstrap**.

## ✨ Funcionalidades

- 📖 **Gerenciar sua estante** - Adicione, remova e organize seus livros
- 📊 **Acompanhar progresso** - Marque livros como "Quero Ler", "Lendo" ou "Lido"
- ⭐ **Avaliações** - Dê notas aos seus livros lidos
- 🔍 **Busca e filtros** - Encontre livros por título, autor ou status
- 📈 **Estatísticas** - Visualize métricas da sua leitura (total, por status, média de avaliações)
- 📱 **Responsivo** - Funciona em desktop, tablet e mobile

## 🚀 Tecnologias

- [React](https://react.dev/) - Biblioteca UI
- [React Bootstrap](https://react-bootstrap.github.io/) - Componentes estilizados
- [Bootstrap](https://getbootstrap.com/) - Framework CSS
- [Vite](https://vitejs.dev/) - Build tool e dev server

## 📦 Instalação

```bash
# Clonar o repositório
git clone https://github.com/74ckson/Boocktracker.git
cd Boocktracker

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:5173`.

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot reload |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Visualiza o build localmente |

## 📁 Estrutura do Projeto

```
booktracker/
├── src/
│   ├── components/     # Componentes React reutilizáveis
│   ├── data/           # Dados iniciais de exemplo
│   ├── App.jsx         # Componente principal
│   ├── App.css         # Estilos globais
│   └── main.jsx        # Ponto de entrada da aplicação
├── index.html          # Template HTML
├── package.json        # Dependências e scripts
└── vite.config.js      # Configuração do Vite
```

## 🎯 Como Usar

1. **Adicionar um livro** — Clique em "Adicionar Livro" e preencha o formulário
2. **Mudar status** — Clique no botão de status do card para alternar entre "Quero Ler" → "Lendo" → "Lido"
3. **Avaliar** — Selecione estrelas no card para dar uma nota (1-5)
4. **Buscar** — Use a barra de pesquisa para filtrar por título ou autor
5. **Filtrar** — Selecione o status desejado para ver apenas livros daquela categoria

## 📸 Preview

> App responsivo para gerenciamento de livros com cards, filtros e estatísticas em tempo real.

## 📄 Licença

ISC

---

Feito com React e Bootstrap 💙
