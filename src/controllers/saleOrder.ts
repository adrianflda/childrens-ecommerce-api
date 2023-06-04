import {
  Request,
  Response,
  RequestHandler,
  NextFunction
} from 'express';
import BadRequest from '../errors/BadRequest';
import IPaginateResponse from '../interfaces/IPaginateResponse';
import ISaleOrder, { ISalesResponse } from '../interfaces/ISaleOrder';
import { ISaleOrderDB } from '../models/saleOrder';
import { IUserDB } from '../models/user';
import { listSaleOrders, createSaleOrder, getSalesByUser } from '../services/saleOrder';

export const externalizeSaleOrder = (saleOrder: ISaleOrderDB): ISaleOrder => {
  const newSaleOrder: ISaleOrder = JSON.parse(JSON.stringify(saleOrder)) as ISaleOrder;
  return {
    id: newSaleOrder.id || saleOrder._id,
    code: newSaleOrder.code,
    user: newSaleOrder.user,
    products: newSaleOrder.products
  };
};

export const externalizeSaleOrders = (
  saleOrdersToExternalize: ISaleOrderDB[]
): ISaleOrder[] => saleOrdersToExternalize
  .map((saleOrder: ISaleOrderDB) => externalizeSaleOrder(saleOrder));

export const getSaleOrderListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    const {
      text,
      productName,
      page,
      limit,
      sortBy,
      sortDirection
    } = req.query as any;
    const filters: Record<string, any> = {
      user,
      text,
      productName
    };

    const pageNumber = (page || 1) as number;
    const entryLimit = (limit || 10) as number;
    const options = {
      limit,
      offset: (pageNumber - 1) * entryLimit,
      sortBy,
      sortDirection
    };

    const { entries, total }: IPaginateResponse = await listSaleOrders(filters, options);

    return res.json({
      message: 'Successful saleOrders read',
      data: externalizeSaleOrders(entries),
      meta: {
        limit,
        page,
        pageCount: Math.ceil((total) / entryLimit),
        total
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const createSaleOrderController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    const {
      products
    } = req.body || {};

    if (!products || !products.length) {
      throw new BadRequest('Products are required');
    }
    if (products.length > 1) {
      throw new BadRequest('Only one type of product is allowed');
    }
    if (products[0].quantity > 1) {
      throw new BadRequest('Only one product for type is allowed');
    }

    const saleOrderResponse = await createSaleOrder(user as IUserDB, products);
    if (!saleOrderResponse) {
      throw new Error('Something went wrong');
    }
    return res.json({
      message: 'Successful saleOrder create',
      data: externalizeSaleOrder(saleOrderResponse)
    });
  } catch (error) {
    return next(error);
  }
};

export const getSalesController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;

    const salesResponse: ISalesResponse = await getSalesByUser(user as IUserDB);
    return res.json({
      message: 'Successful sales read',
      data: salesResponse
    });
  } catch (error) {
    return next(error);
  }
};
