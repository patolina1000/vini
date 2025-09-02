const { successResponse, errorResponse, corsResponse, isOptionsRequest, parseBody, parsePath } = require('./utils');
const { syncpayGet, syncpayPost } = require('../../syncpayApi');

exports.handler = async (event, context) => {
    // Tratar requisições CORS preflight
    if (isOptionsRequest(event)) {
        return corsResponse();
    }

    try {
        const { httpMethod } = event;
        const pathParams = parsePath(event);
        const body = parseBody(event);

        switch (httpMethod) {
            case 'GET':
                // Listar webhooks
                const response = await syncpayGet('/webhooks');
                return successResponse(response.data);

            case 'POST':
                // Criar webhook
                const createResponse = await syncpayPost('/webhooks', body);
                return successResponse(createResponse.data);

            case 'PUT':
                // Atualizar webhook
                const { id } = pathParams;
                if (!id) {
                    return errorResponse('ID do webhook é obrigatório', 400);
                }
                const updateResponse = await syncpayPost(`/webhooks/${id}`, body, { method: 'PUT' });
                return successResponse(updateResponse.data);

            case 'DELETE':
                // Deletar webhook
                const { id: deleteId } = pathParams;
                if (!deleteId) {
                    return errorResponse('ID do webhook é obrigatório', 400);
                }
                const deleteResponse = await syncpayPost(`/webhooks/${deleteId}`, {}, { method: 'DELETE' });
                return successResponse(deleteResponse.data);

            default:
                return errorResponse('Método não permitido', 405);
        }
    } catch (error) {
        console.error('[Webhooks] Erro ao gerenciar webhooks:', error.response?.data || error.message);
        return errorResponse('Erro ao gerenciar webhooks', error.response?.status || 500, error.response?.data || error.message);
    }
};
