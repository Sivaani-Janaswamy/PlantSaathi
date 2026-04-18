// Minimal, production-focused logger for backend/API/database
// DO NOT log sensitive data or debug info

const logger = {
  request: (method, url) => {
    console.log(`[REQUEST] ${method} ${url}`);
  },
  response: (status, method, url, ms) => {
    console.log(`[RESPONSE] ${status} ${method} ${url} (${ms}ms)`);
  },
  error: (message, method, url) => {
    console.error(`[ERROR] ${message} (${method} ${url})`);
  },
  dbQuery: (table, action) => {
    console.log(`[DB QUERY] ${table}/${action}`);
  },
  dbResponse: (table, action, success, ms) => {
    console.log(`[DB RESPONSE] ${success ? 'success' : 'failure'} ${table}/${action} (${ms}ms)`);
  },
  dbError: (message, table, action) => {
    console.error(`[DB ERROR] ${message} (${table}/${action})`);
  }
};

module.exports = logger;
