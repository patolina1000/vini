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

        const response = await syncpayGet('/profile');
        return successResponse(response.data);
    } catch (error) {
        console.error('[Profile] Erro ao consultar perfil:', error.response?.data || error.message);
        return errorResponse('Não foi possível consultar dados do parceiro', error.response?.status || 500, error.response?.data || error.message);
    }
};
