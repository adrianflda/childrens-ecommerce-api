import { ObjectId, PipelineStage } from 'mongoose';
import NotFoundError from '../errors/NotFoundError';
import IPaginateResponse from '../interfaces/IPaginateResponse';
import IProduct from '../interfaces/IProduct';
import IVotes from '../interfaces/IVote';
import ProductModel, { IProductDB } from '../models/product';
import { removeAccents } from '../utils';

/**
 *
 * @param productIdentifier Could be mongo id or sku
 */
export const getProduct = async (productIdentifier: string): Promise<IProductDB | null> => {
  const search = {
    $or: [
      {
        _id: productIdentifier
      },
      {
        sku: productIdentifier
      }
    ]
  };

  return ProductModel.findOne(search);
};

/**
 *
 * @param filter Record<string, any> set of queries to filter listed product (name: 'product1')
 * @param options Record<string, any> set of options to list products (sort: -1, sortField: 'name')
 */
export const listProducts = async (
  filter: Record<string, any>,
  options: Record<string, any>
): Promise<IPaginateResponse> => {
  const query: Record<string, any> = {};
  const anyFieldOr = [];

  if (filter.text) {
    anyFieldOr.push({
      $text: {
        $search: filter.text
      }
    });
  }
  if (filter.name) {
    query.name = filter.name;
  }
  if (filter.category) {
    query.category = filter.category;
  }
  if (filter.price) {
    query.price = filter.price;
  }
  if (filter.stock) {
    query.stock = filter.stock;
  }

  // Only add the 'or' if there are items in it
  if (anyFieldOr && anyFieldOr.length > 0) {
    query.$or = anyFieldOr;
  }

  const aggregate: PipelineStage[] = [
    { $match: query }
  ];

  // Setup sort
  const sort: Record<string, any> = {};
  if (options.sortBy) {
    let sortSign = 1;
    if (options.sortDirection && options.sortDirection === 'desc') {
      sortSign = -1;
    }
    sort[options.sortBy] = sortSign;
  } else {
    // sort alphabetically by default
    sort['name'] = 1;
  }
  aggregate.push(
    { $sort: sort }
  );

  // Setup limit and offset
  const limit = options.limit || 50;
  const offset = options.offset || 0;
  aggregate.push(
    { $skip: offset }
  );
  aggregate.push(
    { $limit: limit }
  );

  return {
    entries: await ProductModel.aggregate(aggregate),
    total: await ProductModel.find(query).countDocuments()
  };
};

/**
 *
 * @param product IProduct the product to be created
 */
export const createProduct = async (product: IProduct): Promise<IProductDB | null> => {
  const newProduct = JSON.parse(JSON.stringify(product));
  newProduct.sku = newProduct.sku || `${Date.now()}`;
  return ProductModel.create(newProduct) as any;
};

/**
 *
 * @param productId String the product id to be updated
 * @param product Product values to be changed
 */
export const updateProduct = async (
  productId: string,
  product: IProduct
): Promise<IProductDB | null> => {
  const newProduct = JSON.parse(JSON.stringify(product));
  delete newProduct.id;
  delete newProduct.sku;
  delete newProduct.feedBack;

  await ProductModel.updateOne({ _id: productId }, newProduct);
  return ProductModel.findOne({ _id: productId });
};

/**
 *
 * @param productId String product id to be updated the vote
 * @param vote Number vote number to be updated
 */
export const updateProductVote = async (
  productId: string,
  vote: number
): Promise<IProductDB | null> => {
  // TODO all this logic should be on a separate collection
  const productFound = await ProductModel.findOne({ _id: productId });
  if (!productFound) {
    throw new NotFoundError('Product not found');
  }

  // eslint-disable-next-line no-nested-ternary
  const validVote = vote >= 5 ? 5 : vote >= 1 ? vote : 1;
  const currentVotes = productFound.feedBack?.votes || 0;
  const currentRating = productFound.feedBack.stars || 1;

  const newRating = (currentRating * currentVotes + validVote) / (currentVotes + 1);

  const productUpdate = {
    $inc: {
      'feedBack.votes': 1
    },
    'feedBack.stars': newRating
  };

  await ProductModel.updateOne({ _id: productId }, productUpdate);
  return ProductModel.findOne({ _id: productId });
};

/**
 *
 * @param productId String product id to be removed
 */
export const removeProduct = async (productId: string): Promise<IProductDB> => {
  const productFound: IProductDB | null = await ProductModel.findOne({ _id: productId });
  if (!productFound) {
    throw new NotFoundError('Product not found');
  }

  await ProductModel.deleteOne({ _id: productId });
  return productFound;
};
