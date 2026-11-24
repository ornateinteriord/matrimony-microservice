const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transcation_id: { // Note: keeping original spelling from example
    type: Number,
    unique: true,
    sparse: true
  },
  transaction_id: {
    type: Number,
    unique: true,
    sparse: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  registration_no: {
    type: String,
    required: true
  },
  PG_id: {
    type: String,
    required: true
  },
  bank_ref_num: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    default: 'UPI' // UPI, CC, NB, etc.
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'PENDING' // PENDING, SUCCESS, FAILURE
  },
  orderno: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },
  usertype: {
    type: String,
    required: true
  },
  promocode: {
    type: String,
    default: null
  },
  discount_applied: {
    type: Number,
    default: 0
  },
  original_amount: {
    type: Number,
    required: true
  },
  is_handled: {
    type: Boolean,
    default: false
  }
}, { 
  collection: 'transaction_tbl',
  timestamps: true 
});

// Auto-increment transaction_id and transcation_id with race-condition prevention
TransactionSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      if (!this.transcation_id || !this.transaction_id) {
        const lastTransaction = await this.constructor.findOne({}, {}, { sort: { 'transcation_id': -1, 'transaction_id': -1 } });
        const lastId = lastTransaction?.transcation_id || lastTransaction?.transaction_id || 0;
        let nextId = Number(lastId) + 1;
        while (await this.constructor.exists({ $or: [{ transaction_id: nextId }, { transcation_id: nextId }] })) {
          nextId++;
        }
        this.transcation_id = nextId;
        this.transaction_id = nextId;
      } else {
        const exists = await this.constructor.exists({
          $or: [{ transaction_id: this.transaction_id }, { transcation_id: this.transcation_id }]
        });
        if (exists) {
          const lastTransaction = await this.constructor.findOne({}, {}, { sort: { 'transcation_id': -1, 'transaction_id': -1 } });
          const lastId = lastTransaction?.transcation_id || lastTransaction?.transaction_id || 0;
          let nextId = Math.max(Number(lastId), Number(this.transaction_id)) + 1;
          while (await this.constructor.exists({ $or: [{ transaction_id: nextId }, { transcation_id: nextId }] })) {
            nextId++;
          }
          this.transcation_id = nextId;
          this.transaction_id = nextId;
        }
      }

      if (!this.orderno || this.orderno.length < 5) {
        this.orderno = `ORD_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
      }
    } catch (error) {
      console.error('Error generating transaction ID:', error);
      const fallbackId = Date.now();
      if (!this.transcation_id) this.transcation_id = fallbackId;
      if (!this.transaction_id) this.transaction_id = fallbackId;
    }
  }
  next();
});

// Indexes for fast lookup and promoter credit checking
TransactionSchema.index({ registration_no: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ promocode: 1 });
TransactionSchema.index({ is_handled: 1 });
TransactionSchema.index({ registration_no: 1, status: 1 });
TransactionSchema.index({ promocode: 1, status: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);