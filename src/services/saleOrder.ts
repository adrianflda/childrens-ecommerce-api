import { PipelineStage } from 'mongoose';
import IPaginateResponse from '../interfaces/IPaginateResponse';
import { ISaleProduct } from '../interfaces/IProduct';
import ISaleOrder, { ISalesResponse } from '../interfaces/ISaleOrder';
import IUser, { ISimpleUser } from '../interfaces/IUser';
import logger from '../lib/logger';
import ProductModel from '../models/product';
import SaleOrderModel, { ISaleOrderDB } from '../models/saleOrder';
import { IUserDB } from '../models/user';
import { getConnection } from '../storage/mongo';
import { getProduct, updateProduct, updateProductStockAfterSell } from './product';

/**
 *
 * @param filter Record<string, any> set of queries to filter listed saleOrder
 * @param options Record<string, any> set of options to list saleOrders
 */
export const listSaleOrders = async (
  filter: Record<string, any>,
  options: Record<string, any>
): Promise<IPaginateResponse> => {
  const query: Record<string, any> = {};
  const anyFieldOr = [];

  if (filter.user && filter.user.roles && !filter.user.roles.includes('admin')) {
    query['user.username'] = filter.user.username;
  }

  if (filter.text) {
    anyFieldOr.push({
      $text: {
        $search: filter.text
      }
    });
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
    entries: await SaleOrderModel.aggregate(aggregate),
    total: await SaleOrderModel.find(query).countDocuments()
  };
};

/**
   *
   * @param saleOrder ISaleOrder the saleOrder to be created
   */
export const createSaleOrder = async (
  user: IUserDB,
  products: ISaleProduct[]
): Promise<ISaleOrderDB | null> => {
  let newSaleOrderResponse: ISaleOrderDB | null = null;
  // const session: any = await getConnection().startSession();

  try {
    // session.startTransaction();

    const newSaleOrder: ISaleOrder = {
      code: `CH-E-${Date.now()}`,
      products: [],
      user: {
        id: user.id || user._id,
        username: user.username,
        displayName: user.displayName,
        profile: user.profile
      }
    };

    // validate the product have stock
    for (const saleOrderProduct of products) {
      const productFound = await getProduct(saleOrderProduct.sku);
      if (productFound && (productFound.stock || 0) >= saleOrderProduct.quantity) {
        newSaleOrder.products.push({
          ...saleOrderProduct,
          name: productFound.name,
          price: productFound.price
        });
      }
      // TODO if not stock enough we need to response a message by product
    }

    // update product stock
    // newSaleOrderResponse = await SaleOrderModel.create([newSaleOrder], { session }) as any;
    newSaleOrderResponse = await SaleOrderModel.create(newSaleOrder);

    for (const saleOrderProduct of newSaleOrder.products) {
      /* await updateProductStockAfterSell(
                                      saleOrderProduct.sku,
                                      saleOrderProduct.quantity,
                                      session
                                    ); */
      await updateProductStockAfterSell(saleOrderProduct.sku, saleOrderProduct.quantity);
    }

    // await session.commitTransaction();
  } catch (error) {
    logger.error(error);
    // await session.abortTransaction();
  }

  // session.endSession();
  return newSaleOrderResponse;
};

export const getSalesByUser = async (user: IUserDB): Promise<ISalesResponse> => {
  const query: Record<string, any> = {};
  if (!user.roles?.includes('admin')) {
    query['user.username'] = user.username;
  }
  const saleOrders = await SaleOrderModel.find(query);

  const response: ISalesResponse = {
    totalSales: 0,
    totalProducts: 0,
    products: []
  };
  for (const saleOrder of saleOrders) {
    response.totalSales += saleOrder.products
      .reduce((sum, product) => sum + (product.price * product.quantity), 0);
    response.totalProducts = saleOrder.products
      .reduce((sum, product) => sum + product.quantity, 0);
    response.products.push(...saleOrder.products);
  }
  return response;
};
