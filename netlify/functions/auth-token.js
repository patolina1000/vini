const { successResponse, errorResponse, corsResponse, isOptionsRequest, parseBody, fetchWithTimeout } = require('./utils');

exports.handler = async (event, context) => {
    // Tratar requisições CORS preflight
    if (isOptionsRequest(event)) {
        return corsResponse();
    }

    try {
        // Apenas permitir requisições POST
        if (event.httpMethod !== 'POST') {
            return errorResponse('Método não permitido', 405);
        }

        const body = parseBody(event);
        
        // Usar o valor do campo obrigatório da requisição ou um valor padrão
        const extraField = body['01K1259MAXE0TNRXV2C2WQN2MV'] || 'valor';
        
        // Verificar se as credenciais estão disponíveis
        const clientId = process.env.SYNCPAY_CLIENT_ID;
        const clientSecret = process.env.SYNCPAY_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            console.error('[Auth] Credenciais não configuradas');
            return errorResponse('Credenciais da API não configuradas', 500, 'SYNCPAY_CLIENT_ID ou SYNCPAY_CLIENT_SECRET não definidos');
        }

        const authData = {
            client_id: clientId,
            client_secret: clientSecret,
            '01K1259MAXE0TNRXV2C2WQN2MV': extraField
        };

        try {
            const response = await fetchWithTimeout('https://api.syncpayments.com.br/api/partner/v1/auth-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'SyncPay-Integration/1.0'
                },
                body: JSON.stringify(authData)
            }, 30000);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[Auth] Erro na autenticação:', response.status, errorText);
                
                // Tentar parsear como JSON se possível
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData = { message: errorText };
                }
                
                return errorResponse('Erro na autenticação com a API SyncPayments', response.status, errorData);
            }

            const data = await response.json();
            
            // Validar se a resposta contém os campos obrigatórios
            if (!data.access_token) {
                console.error('[Auth] Token não encontrado na resposta');
                return errorResponse('Resposta inválida da API', 500, 'access_token não encontrado na resposta');
            }
            
            return successResponse(data);
            
        } catch (fetchError) {
            if (fetchError.name === 'AbortError') {
                console.error('[Auth] Timeout na requisição para API externa');
                return errorResponse('Timeout na conexão com a API SyncPayments', 504, 'A requisição demorou mais de 30 segundos');
            }
            
            console.error('[Auth] Erro de rede:', fetchError.message);
            return errorResponse('Erro de conexão com a API SyncPayments', 503, fetchError.message);
        }

    } catch (error) {
        console.error('[Auth] Erro ao obter token:', error.message);
        return errorResponse('Erro interno do servidor', 500, error);
    }
};
