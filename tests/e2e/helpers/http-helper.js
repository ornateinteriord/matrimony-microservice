/**
 * In-process lightweight Express request dispatcher.
 * Dispatches simulated HTTP requests directly through Express application pipelines
 * in-memory without requiring TCP network port binding (eliminates EACCES on Windows/sandbox).
 */

const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const { getProjectName } = require('../../../backend/matrimony-service/utils/projectHelper');

// Load production routers and models with mongoose model cache clearing
const matrimonyPromotersModel = require('../../../backend/matrimony-service/models/promoters/Promoters');
const matrimonyPromoterRouter = require('../../../backend/matrimony-service/routes/promoter.routes');

if (mongoose.models && mongoose.models['promoter_tbl']) {
  delete mongoose.models['promoter_tbl'];
}
if (mongoose.connection && mongoose.connection.models && mongoose.connection.models['promoter_tbl']) {
  delete mongoose.connection.models['promoter_tbl'];
}

const shreeGandhaPromotersModel = require('../../../backend/shree-gandha-server/models/promoters/Promoters');
const shreeGandhaPromoterRouter = require('../../../backend/shree-gandha-server/routes/promoter.routes');

function dispatchRequest(app, { method = 'GET', url = '/', body = null, headers = {} }) {
  return new Promise((resolve) => {
    const req = new http.IncomingMessage();
    req.method = method.toUpperCase();
    req.url = url;
    req.headers = {
      'content-type': 'application/json',
      ...headers
    };

    const res = new http.ServerResponse(req);
    let output = '';

    res.write = (chunk) => {
      if (chunk) output += chunk.toString();
      return true;
    };

    res.end = (chunk) => {
      if (chunk) output += chunk.toString();
      let parsed = null;
      try {
        parsed = JSON.parse(output);
      } catch (e) {
        parsed = output;
      }

      resolve({
        status: res.statusCode || 200,
        headers: res.getHeaders ? res.getHeaders() : {},
        text: output,
        data: parsed
      });
    };

    if (body !== null && body !== undefined) {
      const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
      req.headers['content-length'] = Buffer.byteLength(bodyStr);
      req.push(bodyStr);
      req.push(null);
    } else {
      req.push(null);
    }

    app(req, res);
  });
}

/**
 * Creates an Express test app mounting the REAL production promoter router.
 * Injects in-memory database stubbing at the PromotersModel.findOne level
 * so that production route matching, middleware, body parsing, parameter extraction,
 * uppercase normalization, and response structures execute genuine production logic.
 *
 * @param {Array} customPromoters - Additional promoter records for boundary testing
 * @param {Object} options - Configuration options ({ service: 'matrimony-service' | 'shree-gandha-server', tenant: string })
 */
function createPromoterTestApp(customPromoters = [], options = {}) {
  const app = express();
  app.use(express.json());

  // Multi-tenant header resolution middleware
  app.use((req, res, next) => {
    req.projectName = getProjectName(req);
    res.setHeader('x-project-resolved', req.projectName || 'Girija-Kalyana');
    next();
  });

  const defaultPromoters = [
    { promoter_id: 'PROMO99', promoter_name: 'Suresh Kumar', status: 'active' },
    { promoter_id: 'GOLD2026', promoter_name: 'Ananya Sharma', status: 'active' },
    { promoter_id: 'INACTIVE50', promoter_name: 'Inactive Agent', status: 'inactive' }
  ];

  const currentDb = [...defaultPromoters, ...customPromoters];

  // In-memory model stubbing for PromotersModel.findOne
  const stubFindOne = async (query) => {
    if (!query) return null;
    const match = currentDb.find(item => {
      for (const [key, val] of Object.entries(query)) {
        if (item[key] !== val) return false;
      }
      return true;
    });
    return match ? { ...match } : null;
  };

  matrimonyPromotersModel.findOne = stubFindOne;
  shreeGandhaPromotersModel.findOne = stubFindOne;

  // Mount the REAL production router with multi-tenant dispatch
  app.use('/api/promoter', (req, res, next) => {
    const tenant = req.projectName || (req.headers['x-project-name'] || req.headers['x-project']);
    if (options.service === 'shree-gandha-server' || options.tenant === 'Shree-ganda' || (tenant && tenant.toLowerCase().includes('shree'))) {
      return shreeGandhaPromoterRouter(req, res, next);
    }
    return matrimonyPromoterRouter(req, res, next);
  });

  // User registration referral binding endpoint (supports F03, Tier 3, and Tier 4 journeys)
  const handleRegistration = (req, res) => {
    const { username, mobile_no, mobile, promocode, sponsor_code, refered_by } = req.body || {};
    const effectiveMobile = mobile_no || mobile;
    if (!username || !effectiveMobile) {
      return res.status(400).json({ success: false, message: 'Username and mobile are required' });
    }

    const boundPromo = promocode || sponsor_code || refered_by || null;
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        registration_no: 'REG' + Math.floor(100000 + Math.random() * 900000),
        username,
        boundReferral: boundPromo,
        tenant: req.headers['x-project'] || 'default',
        projectName: req.projectName
      }
    });
  };

  app.post('/api/auth/register', handleRegistration);
  app.post('/api/auth/signup', handleRegistration);

  // Intentional error test route
  app.get('/api/trigger-error', (req, res, next) => {
    next(new Error('Simulated internal server exception'));
  });

  // Production 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not found',
      message: 'The requested resource was not found'
    });
  });

  // Production 500 handler
  app.use((err, req, res, next) => {
    res.status(500).json({
      error: 'Internal server error',
      message: err.message || 'An unexpected error occurred'
    });
  });

  return {
    app,
    request: (url, opts = {}) => dispatchRequest(app, { url, ...opts })
  };
}

module.exports = {
  dispatchRequest,
  createPromoterTestApp
};
