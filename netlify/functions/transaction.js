const { successResponse, errorResponse, corsResponse, isOptionsRequest, parsePath } = require('./utils');
const { syncpayGet } = require('../../syncpayApi');

exports.handler = async (event, context) => {
    // Tratar requisições CORS preflight
    if (isOptionsRequest(event)) {
        return corsResponse();
    }

    try {
        // Apenas permitir requisições GET
        if (event.httpMethod !== 'GET') {
            return errorResponse('Método não permitido', 405);
        }

        const { identifier } = parsePath(event);
        
        if (!identifier) {
            return errorResponse('Identificador da transação é obrigatório', 400);
        }

        const response = await syncpayGet(`/transaction/${identifier}`);
        return successResponse(response.data);
    } catch (error) {
        console.error('[Transaction] Erro ao consultar status:', error.response?.data || error.message);
        return errorResponse('Não foi possível consultar o status da transação', error.response?.status || 500, error.response?.data || error.message);
    }
};
