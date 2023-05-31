import mongoose, { Document } from 'mongoose';
import ISaleOrder from '../interfaces/ISaleOrder';

interface ISaleOrderDB extends ISaleOrder, Document { }

const SaleOrderSchema = new mongoose.Schema({
  code: {
    type: String,
    sparse: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    required: true
  },
  user: {
    type: Object,
    default: {
      id: null,
      username: null,
      displayName: null,
      profile: {
        address: null
      }
    }
  },
  products: {
    type: Array,
    default: []
  }
}, {
  timestamps: true
});

SaleOrderSchema.index({
  code: 'text',
  'user.username': 'text',
  'user.displayName': 'text',
  'user.profile.phone': 'text',
  'user.profile.email': 'text',
  'user.profile.address': 'text',
  'products.name': 'text'
});

const SaleOrderModel = mongoose.model('SaleOrder', SaleOrderSchema);

export { SaleOrderModel, ISaleOrderDB };
export default SaleOrderModel;
