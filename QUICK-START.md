# 🚀 Início Rápido - Netlify Functions

## ✅ O que foi feito

- ✅ Criada pasta `netlify/functions/` com todas as funções serverless
- ✅ Convertidas todas as rotas do Express para funções Netlify
- ✅ Criado `netlify.toml` com configurações
- ✅ Criado `package.json` específico para as funções
- ✅ Criados utilitários compartilhados
- ✅ Configurado CORS para todas as funções

## 🎯 Próximos Passos

### 1. Configurar Variáveis de Ambiente
No painel da Netlify, vá em **Site settings → Environment variables**:

```env
SYNCPAY_CLIENT_ID=seu_client_id
SYNCPAY_CLIENT_SECRET=seu_client_secret
PUSHINPAY_TOKEN=seu_token
PUSHINPAY_ENVIRONMENT=production
ENVIRONMENT=production
WEBHOOK_SECRET=seu_webhook_secret
```

### 2. Testar Localmente
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Executar localmente
netlify dev
```

### 3. Fazer Deploy
```bash
# Deploy manual
netlify deploy --prod

# Ou conectar repositório Git para deploy automático
```

## 🔗 URLs das Funções

- `/api/config` → `config`
- `/api/auth-token` → `auth-token`
- `/api/balance` → `balance`
- `/api/cash-in` → `cash-in`
- `/api/cash-out` → `cash-out`
- `/api/transaction/:id` → `transaction`
- `/api/profile` → `profile`
- `/api/webhooks` → `webhooks`
- `/api/gateways/*` → `gateways`
- `/api/payments/*` → `payments`
- `/api/controller/*` → `controller`
- `/api/health` → `health`

## 📁 Arquivos Importantes

- `netlify.toml` - Configuração da Netlify
- `netlify/functions/utils.js` - Utilitários compartilhados
- `README-NETLIFY.md` - Documentação completa
- `env-example.txt` - Exemplo de variáveis de ambiente

## ⚠️ Importante

- O arquivo `server.js` não será mais usado
- Todas as rotas agora são funções serverless
- Configure as variáveis de ambiente na Netlify
- Use `netlify dev` para testar localmente
