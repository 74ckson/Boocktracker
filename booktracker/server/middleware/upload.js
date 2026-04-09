// ============================================================================
// server/middleware/upload.js - Configuração do Multer para Uploads
// ============================================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criar pasta uploads se não existir
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar armazenamento: onde e como salvar os arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único: timestamp + nome original
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// Filtro: aceitar apenas JPG e PNG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Aceita o arquivo
  } else {
    cb(new Error('Apenas imagens JPG e PNG são permitidas!'), false);
  }
};

// Configurar multer com limites
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Máximo 5MB
  }
});

module.exports = upload;
