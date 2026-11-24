/**
 * Centralized MongoDB Error Handling and Duplicate Key (E11000) Interceptor
 */

const FIELD_LABELS = {
  username: "Username",
  email_id: "Email address",
  email: "Email address",
  mobile_no: "Mobile number",
  mobile: "Mobile number",
  mobileNumber: "Mobile number",
  registration_no: "Registration number",
  ref_no: "Reference number",
  user_id: "User ID",
  transaction_id: "Transaction ID",
  transcation_id: "Transaction ID",
  orderno: "Order number",
  token: "Login token",
  promoter_id: "Promoter ID",
  id: "ID",
};

const SPECIFIC_MESSAGES = {
  username: "This username is already taken. Please choose another username or log in.",
  email_id: "This email address is already registered. Please log in or use a different email.",
  email: "This email address is already registered. Please log in or use a different email.",
  mobile_no: "This mobile number is already registered. Please use a different mobile number.",
  mobile: "This mobile number is already registered. Please use a different mobile number.",
  registration_no: "A profile with this registration number already exists. Please try again.",
  ref_no: "A profile with this reference number already exists. Please try again.",
  user_id: "A user account with this ID already exists. Please try registering again.",
  transaction_id: "A transaction with this identifier already exists.",
  transcation_id: "A transaction with this identifier already exists.",
  orderno: "A transaction with this order reference number already exists.",
  token: "This one-time login token already exists. Please generate a new one.",
  unique_interest: "You have already expressed interest in this profile.",
  sender_1_recipient_1: "You have already expressed interest in this profile.",
  promoter_id: "A promoter with this ID already exists.",
};

/**
 * Check if an error is a MongoDB Duplicate Key Error (E11000)
 */
function isDuplicateKeyError(err) {
  if (!err) return false;
  return (
    err.code === 11000 ||
    err.code === 11001 ||
    (err.name === 'MongoServerError' && err.code === 11000) ||
    (err.name === 'MongoError' && err.code === 11000) ||
    (typeof err.message === 'string' && (err.message.includes('E11000') || err.message.includes('duplicate key error')))
  );
}

/**
 * Parse and format MongoDB duplicate key error into a user-friendly message
 */
function formatDuplicateKeyError(err) {
  let field = null;
  let value = null;

  // 1. Check keyValue object (standard in Mongoose / MongoDB driver 4+)
  if (err.keyValue && typeof err.keyValue === 'object' && Object.keys(err.keyValue).length > 0) {
    const keys = Object.keys(err.keyValue);
    field = keys[0];
    value = err.keyValue[field];
  }

  // 2. Fallback to keyPattern
  if (!field && err.keyPattern && typeof err.keyPattern === 'object') {
    const keys = Object.keys(err.keyPattern);
    if (keys.length > 0) {
      field = keys[0];
    }
  }

  // 3. Fallback to parsing error message string
  const message = err.message || '';
  if (!field && message) {
    // Regex matching index: collection index: index_name_1 or index: name
    const indexMatch = message.match(/index:\s*([^\s]+)/i);
    if (indexMatch && indexMatch[1]) {
      const rawIndex = indexMatch[1].replace(/_\d+$/, ''); // strip _1 suffix
      field = rawIndex;
    }

    // Regex matching dup key: { field: "value" } or { field: 123 }
    const dupKeyMatch = message.match(/dup key:\s*\{\s*([a-zA-Z0-9_]+)\s*:\s*([^}]+)\s*\}/i);
    if (dupKeyMatch) {
      if (!field) field = dupKeyMatch[1];
      if (!value) value = dupKeyMatch[2].trim().replace(/^["']|["']$/g, '');
    }
  }

  // Handle compound unique interest index
  if (field === 'unique_interest' || field === 'sender_1_recipient_1' || message.includes('unique_interest')) {
    return {
      field: 'interest',
      value: null,
      message: SPECIFIC_MESSAGES.unique_interest,
    };
  }

  const cleanField = field ? field.trim() : 'record';
  const label = FIELD_LABELS[cleanField] || cleanField.replace(/_/g, ' ');

  let friendlyMessage;
  if (SPECIFIC_MESSAGES[cleanField]) {
    friendlyMessage = SPECIFIC_MESSAGES[cleanField];
  } else if (value !== null && typeof value !== 'undefined') {
    friendlyMessage = `${label} '${value}' is already in use. Please use a different value.`;
  } else {
    friendlyMessage = `A record with this ${label} already exists. Please use a unique value.`;
  }

  return {
    field: cleanField,
    value: value || null,
    message: friendlyMessage,
  };
}

/**
 * Controller helper to send standardized error response
 */
function handleControllerError(res, error, defaultMessage = "Internal server error") {
  if (isDuplicateKeyError(error)) {
    const { field, message } = formatDuplicateKeyError(error);
    return res.status(409).json({
      success: false,
      error: "DuplicateRecordConflict",
      field,
      message,
    });
  }

  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || defaultMessage;
  return res.status(statusCode).json({
    success: false,
    message,
  });
}

/**
 * Express middleware to catch duplicate key errors in next(err) pipeline
 */
function duplicateKeyErrorMiddleware(err, req, res, next) {
  if (isDuplicateKeyError(err)) {
    const { field, message } = formatDuplicateKeyError(err);
    console.warn(`[DuplicateKeyInterceptor] Handled duplicate key on ${req.method} ${req.path}: ${message}`);
    return res.status(409).json({
      success: false,
      error: "DuplicateRecordConflict",
      field,
      message,
    });
  }
  next(err);
}

module.exports = {
  isDuplicateKeyError,
  formatDuplicateKeyError,
  handleControllerError,
  duplicateKeyErrorMiddleware,
};
