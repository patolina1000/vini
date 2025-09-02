const { successResponse, errorResponse, corsResponse, isOptionsRequest } = require('./utils');
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

        const response = await syncpayGet('/balance');
        return successResponse(response.data);
    } catch (error) {
        console.error('[Balance] Erro ao obter saldo:', error.response?.data || error.message);
        return errorResponse('Não foi possível obter o saldo', 500, error.response?.data || error.message);
    }
};
