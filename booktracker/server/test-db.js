// Teste rápido do banco de dados
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

console.log('🧪 Testando banco de dados...\n');

const dbPath = path.join(__dirname, 'booktracker.db');
console.log('📍 Caminho:', dbPath);

try {
  const db = new Database(dbPath);
  console.log('✅ Banco conectado\n');

  // Testar query
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get('demo@booktracker.com');
  
  if (user) {
    console.log('👤 Usuário encontrado:', user.name);
    console.log('📧 Email:', user.email);
    console.log('🔑 Hash stored:', user.password_hash.substring(0, 40) + '...');
    
    // Testar bcrypt
    const testPassword = '123456';
    const match = bcrypt.compareSync(testPassword, user.password_hash);
    
    console.log('\n🔐 Testando senha "' + testPassword + '":', match ? '✅ MATCH!' : '❌ NO MATCH');
    
    if (!match) {
      console.log('\n⚠️  PROBLEMA: A senha não está batendo!');
      console.log('🔧 Vamos criar um novo hash...');
      
      const newHash = bcrypt.hashSync('123456', 10);
      console.log('✨ Novo hash:', newHash.substring(0, 40) + '...');
      
      db.prepare('UPDATE users SET password_hash = ? WHERE email = ?').run(newHash, 'demo@booktracker.com');
      console.log('✅ Senha atualizada!\n');
      
      // Testar de novo
      const user2 = db.prepare('SELECT * FROM users WHERE email = ?').get('demo@booktracker.com');
      const match2 = bcrypt.compareSync('123456', user2.password_hash);
      console.log('🔐 Testando novamente:', match2 ? '✅ MATCH!' : '❌ NO MATCH');
    }
  } else {
    console.log('❌ Usuário demo não encontrado!');
    console.log('📊 Total de usuários:', db.prepare('SELECT COUNT(*) as count FROM users').get().count);
  }

  db.close();
  console.log('\n✅ Teste concluído');
} catch (error) {
  console.error('\n❌ ERRO:', error.message);
  console.error(error);
}
