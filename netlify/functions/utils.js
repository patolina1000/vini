const fetch = require('node-fetch');
const { getConfig } = require('../../loadConfig');

/**
 * Utilitários compartilhados para funções serverless
 */

// Configuração CORS para funções serverless
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, Origin, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Content-Type': 'application/json'
};

/**
 * Resposta de sucesso padronizada
 */
function successResponse(data, statusCode = 200) {
    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify({
            success: true,
            data,
            timestamp: new Date().toISOString()
        })
    };
}

/**
 * Resposta de erro padronizada
 */
function errorResponse(message, statusCode = 500, error = null) {
    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify({
            success: false,
            message,
            error: error?.message || error,
            timestamp: new Date().toISOString()
        })
    };
}

/**
 * Resposta CORS para requisições OPTIONS
 */
function corsResponse() {
    return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
    };
}

/**
 * Função auxiliar para fazer requisições HTTP com timeout
 */
async function fetchWithTimeout(url, options = {}, timeout = 30000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Validar se é uma requisição OPTIONS (CORS preflight)
 */
function isOptionsRequest(event) {
    return event.httpMethod === 'OPTIONS';
}

/**
 * Extrair dados do corpo da requisição
 */
function parseBody(event) {
    try {
        if (event.body) {
            return typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        }
        return {};
    } catch (error) {
        return {};
    }
}

/**
 * Extrair parâmetros de query
 */
function parseQuery(event) {
    return event.queryStringParameters || {};
}

/**
 * Extrair parâmetros de path
 */
function parsePath(event) {
    return event.pathParameters || {};
}

module.exports = {
    corsHeaders,
    successResponse,
    errorResponse,
    corsResponse,
    fetchWithTimeout,
    isOptionsRequest,
    parseBody,
    parseQuery,
    parsePath,
    getConfig
};
