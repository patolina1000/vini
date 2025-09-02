const { successResponse, errorResponse, corsResponse, isOptionsRequest, parseBody } = require('./utils');
const { syncpayPost } = require('../../syncpayApi');

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
        const response = await syncpayPost('/cash-in', body);
        return successResponse(response.data);
    } catch (error) {
        console.error('[Cash-in] Erro ao criar transação:', error.response?.data || error.message);
        return errorResponse('Não foi possível criar a transação', error.response?.status || 500, error.response?.data || error.message);
    }
};
