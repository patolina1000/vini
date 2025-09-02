#!/usr/bin/env node

/**
 * Script de configuração para Netlify Functions
 * Executa: node setup-netlify.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando projeto para Netlify Functions...\n');

// Verificar se a pasta netlify/functions existe
const functionsPath = path.join(__dirname, 'netlify', 'functions');
if (!fs.existsSync(functionsPath)) {
    console.error('❌ Pasta netlify/functions não encontrada!');
    console.log('Execute primeiro: mkdir -p netlify/functions');
    process.exit(1);
}

// Instalar dependências das funções
console.log('📦 Instalando dependências das funções serverless...');
try {
    execSync('npm install', { 
        cwd: functionsPath, 
        stdio: 'inherit' 
    });
    console.log('✅ Dependências instaladas com sucesso!\n');
} catch (error) {
    console.error('❌ Erro ao instalar dependências:', error.message);
    process.exit(1);
}

// Verificar arquivos necessários
console.log('🔍 Verificando arquivos necessários...');
const requiredFiles = [
    'netlify.toml',
    'netlify/functions/utils.js',
    'netlify/functions/config.js',
    'netlify/functions/auth-token.js',
    'netlify/functions/balance.js',
    'netlify/functions/cash-in.js',
    'netlify/functions/cash-out.js',
    'netlify/functions/transaction.js',
    'netlify/functions/profile.js',
    'netlify/functions/webhooks.js',
    'netlify/functions/gateways.js',
    'netlify/functions/payments.js',
    'netlify/functions/controller.js',
    'netlify/functions/health.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - NÃO ENCONTRADO`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ Alguns arquivos necessários não foram encontrados!');
    process.exit(1);
}

console.log('\n✅ Todos os arquivos necessários foram encontrados!');

// Verificar se Netlify CLI está instalado
console.log('\n🔧 Verificando Netlify CLI...');
try {
    execSync('netlify --version', { stdio: 'pipe' });
    console.log('✅ Netlify CLI está instalado!');
} catch (error) {
    console.log('⚠️  Netlify CLI não está instalado.');
    console.log('Para instalar: npm install -g netlify-cli');
}

console.log('\n🎉 Configuração concluída com sucesso!');
console.log('\n📋 Próximos passos:');
console.log('1. Configure as variáveis de ambiente no painel da Netlify');
console.log('2. Para testar localmente: netlify dev');
console.log('3. Para fazer deploy: netlify deploy --prod');
console.log('\n📚 Consulte o arquivo README-NETLIFY.md para mais detalhes.');
