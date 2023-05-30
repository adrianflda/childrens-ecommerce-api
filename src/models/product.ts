import mongoose, { Document } from 'mongoose';
import IProduct from '../interfaces/IProduct';

interface IProductDB extends IProduct, Document { }

const ProductSchema = new mongoose.Schema({
  sku: {
    type: String,
    sparse: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    required: true
  },
  name: {
    type: String,
    index: true,
    required: true
  },
  price: {
    type: Number,
    require: true,
    default: 0.0
  },
  stock: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  extraInfo: {
    type: String,
    default: ''
  },
  tags: {
    type: Array<String>,
    default: []
  },
  images: {
    type: Array<String>,
    default: []
  },
  // TODO this field should move to use a different collection Votes
  feedBack: {
    type: Object,
    default: {
      votes: 0,
      stars: 1
    }
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

ProductSchema.index({
  sku: 'text',
  name: 'text',
  category: 'text',
  description: 'text',
  extraInfo: 'text',
  tags: 'text'
});

const ProductModel = mongoose.model('Product', ProductSchema);

export { ProductModel, IProductDB };
export default ProductModel;
