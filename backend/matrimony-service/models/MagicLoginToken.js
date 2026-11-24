const mongoose = require('mongoose');

const MagicLoginTokenSchema = new mongoose.Schema({
  token: { 
    type: String, 
    required: true, 
    unique: true, 
    sparse: true 
  },
  user_id: { 
    type: Number, 
    required: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  promoter_id: { 
    type: String, 
    default: null 
  },
  is_used: { 
    type: Boolean, 
    default: false, 
    index: true 
  },
  used_at: { 
    type: Date, 
    default: null 
  },
  expires_at: { 
    type: Date, 
    required: true, 
    index: { expires: 0 } // TTL index automatically cleans up expired tokens in MongoDB
  }
}, { 
  timestamps: true,
  collection: 'magic_login_tokens'
});

module.exports = mongoose.model('MagicLoginToken', MagicLoginTokenSchema);
