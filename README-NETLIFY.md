# Deploy na Netlify - Sistema de Pagamentos

Este projeto foi convertido para funcionar como funções serverless na Netlify, mantendo o frontend estático e convertendo todas as rotas do backend em funções serverless.

## 📁 Estrutura do Projeto

```
privacy---sync/
├── public/                    # Frontend estático (HTML/CSS/JS)
├── netlify/
│   ├── functions/            # Funções serverless
│   │   ├── utils.js          # Utilitários compartilhados
│   │   ├── config.js         # Configuração pública
│   │   ├── auth-token.js     # Autenticação
│   │   ├── balance.js        # Consulta de saldo
│   │   ├── cash-in.js        # Transação cash-in
│   │   ├── cash-out.js       # Transação cash-out
│   │   ├── transaction.js    # Status de transação
│   │   ├── profile.js        # Perfil do parceiro
│   │   ├── webhooks.js       # Gerenciamento de webhooks
│   │   ├── gateways.js       # Gateways de pagamento
│   │   ├── payments.js       # Pagamentos unificados
│   │   ├── controller.js     # Controller de pagamentos
│   │   └── health.js         # Health check
│   └── package.json          # Dependências das funções
├── netlify.toml              # Configuração da Netlify
├── package.json              # Dependências principais
└── README-NETLIFY.md         # Esta documentação
```

## 🚀 Como Fazer Deploy

### 1. Preparar o Projeto

```bash
# Instalar dependências das funções serverless
cd netlify/functions
npm install

# Voltar para a raiz
cd ../..
```

### 2. Configurar Variáveis de Ambiente

No painel da Netlify, vá em **Site settings → Environment variables** e configure:

```env
# Configurações SyncPay
SYNCPAY_CLIENT_ID=seu_client_id
SYNCPAY_CLIENT_SECRET=seu_client_secret

# Configurações PushInPay
PUSHINPAY_TOKEN=seu_token
PUSHINPAY_ENVIRONMENT=production

# Outras configurações
ENVIRONMENT=production
WEBHOOK_SECRET=seu_webhook_secret
```

**Descrição das chaves:**

- `SYNCPAY_CLIENT_ID` – ID do cliente fornecido pela SyncPay.
- `SYNCPAY_CLIENT_SECRET` – segredo utilizado na autenticação SyncPay.
- `PUSHINPAY_TOKEN` – token de acesso à API PushinPay.
- `PUSHINPAY_ENVIRONMENT` – ambiente da PushinPay (`production` ou `sandbox`).
- `ENVIRONMENT` – ambiente geral da aplicação.
- `WEBHOOK_SECRET` – chave para validar chamadas de webhook.

### 3. Deploy via Git (Recomendado)

1. Conecte seu repositório Git à Netlify
2. Configure as variáveis de ambiente
3. A Netlify fará deploy automático a cada push

### 4. Deploy Manual

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Fazer login
netlify login

# Deploy
netlify deploy --prod
```

## 🧪 Teste Local

### 1. Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Executar Localmente

```bash
# Na raiz do projeto
netlify dev
```

O projeto estará disponível em `http://localhost:8888`

## 🔄 Mapeamento de Rotas

| Rota Original | Função Serverless | Arquivo |
|---------------|-------------------|---------|
| `/api/config` | `config` | `netlify/functions/config.js` |
| `/api/auth-token` | `auth-token` | `netlify/functions/auth-token.js` |
| `/api/balance` | `balance` | `netlify/functions/balance.js` |
| `/api/cash-in` | `cash-in` | `netlify/functions/cash-in.js` |
| `/api/cash-out` | `cash-out` | `netlify/functions/cash-out.js` |
| `/api/transaction/:id` | `transaction` | `netlify/functions/transaction.js` |
| `/api/profile` | `profile` | `netlify/functions/profile.js` |
| `/api/webhooks` | `webhooks` | `netlify/functions/webhooks.js` |
| `/api/gateways/*` | `gateways` | `netlify/functions/gateways.js` |
| `/api/payments/*` | `payments` | `netlify/functions/payments.js` |
| `/api/controller/*` | `controller` | `netlify/functions/controller.js` |
| `/api/health` | `health` | `netlify/functions/health.js` |

## ⚠️ Importante

- **Arquivo `server.js`**: Não será mais usado após o deploy
- **Porta**: As funções serverless não precisam de porta específica
- **Variáveis de ambiente**: Configure no painel da Netlify
- **Timeout**: Funções têm limite de 10 segundos (plano gratuito) ou 30 segundos (planos pagos)

## 🔧 Troubleshooting

### Erro de CORS
- Verifique se as funções estão retornando os headers corretos
- Use o arquivo `utils.js` para headers padronizados

### Erro de Dependências
- Verifique se `netlify/functions/package.json` tem todas as dependências
- Execute `npm install` na pasta `netlify/functions`

### Erro de Configuração
- Verifique se as variáveis de ambiente estão configuradas
- Use `netlify dev` para testar localmente

## 📞 Suporte

Para problemas específicos da Netlify:
- [Documentação oficial](https://docs.netlify.com/)
- [Comunidade](https://community.netlify.com/)
- [Status](https://status.netlify.com/)
