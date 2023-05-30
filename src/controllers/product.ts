import {
  Request, Response, RequestHandler, NextFunction, query
} from 'express';
import { products } from '../../tests/utils/product';
import NotFoundError from '../errors/NotFoundError';
import IPaginateResponse from '../interfaces/IPaginateResponse';
import IProduct from '../interfaces/IProduct';
import { IProductDB } from '../models/product';
import {
  createProduct,
  getProduct,
  listProducts,
  removeProduct,
  updateProduct,
  updateProductVote
} from '../services/product';

export const externalizeProduct = (product: IProductDB): IProduct => {
  const newProduct: IProduct = JSON.parse(JSON.stringify(product)) as IProduct;
  return {
    id: newProduct.id || product._id,
    sku: newProduct.sku,
    name: newProduct.name,
    price: newProduct.price,
    stock: newProduct.stock,
    category: newProduct.category,
    tags: newProduct.tags,
    description: newProduct.description,
    extraInfo: newProduct.extraInfo,
    // TODO this field should move to use a different collection Votes
    feedBack: {
      votes: newProduct.feedBack?.votes || 0,
      stars: parseFloat((newProduct.feedBack?.stars || 0).toFixed(2))
    },
    images: newProduct.images
  };
};

export const externalizeProducts = (
  productsToExternalize: IProductDB[]
): IProduct[] => productsToExternalize
  .map((product: IProductDB) => externalizeProduct(product));

export const getProductController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    const productFound: IProductDB | null = await getProduct(productId);
    if (!productFound) {
      throw new NotFoundError('Product not found');
    }

    return res.json({
      message: 'Successful product read',
      data: externalizeProduct(productFound)
    });
  } catch (error) {
    return next(error);
  }
};

export const getProductListController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      text,
      name,
      tags,
      category,
      price,
      stock,
      page,
      limit,
      sortBy,
      sortDirection
    } = req.query as any;
    const filters: Record<string, any> = {
      text,
      category,
      name,
      tags
    };
    if (price) {
      filters.price = parseFloat(price);
    }
    if (stock) {
      filters.stock = parseFloat(stock);
    }

    const pageNumber = (page || 1) as number;
    const entryLimit = (limit || 10) as number;
    const options = {
      limit,
      offset: (pageNumber - 1) * entryLimit,
      sortBy,
      sortDirection
    };

    const { entries, total }: IPaginateResponse = await listProducts(filters, options);

    return res.json({
      message: 'Successful products read',
      data: externalizeProducts(entries),
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

export const createProductController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = req.body;

    return res.json({
      message: 'Successful product create',
      data: externalizeProduct({} as IProductDB)
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProductController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const product = req.body;

    const productResponse: IProductDB | null = await updateProduct(productId, product);
    if (!productResponse) {
      throw new NotFoundError('Product not found');
    }

    return res.json({
      message: 'Successful product update',
      data: externalizeProduct(productResponse)
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProductVoteController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { vote } = req.body;

    // TODO refactor this flow to use a separate collection for voting process
    const productResponse = await updateProductVote(productId, parseFloat(vote));
    if (!productResponse) {
      throw new NotFoundError('Product not found');
    }

    return res.json({
      message: 'Successful product vote',
      data: externalizeProduct(productResponse)
    });
  } catch (error) {
    return next(error);
  }
};

export const removeProductController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    const productResponse = await removeProduct(productId);

    return res.json({
      message: 'Successful product remove',
      data: externalizeProduct(productResponse)
    });
  } catch (error) {
    return next(error);
  }
};

export const populateProductsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productList = Array.isArray(req.body) ? req.body : products;

    const responses = [];
    for (const product of productList) {
      const response: Record<string, any> = {};
      try {
        const productResponse: IProductDB | null = await createProduct(product);
        if (productResponse) {
          response.message = `Successful added product:${product.name}`;
          response.data = externalizeProduct(productResponse);
        } else {
          throw new Error('Something went wrong');
        }
      } catch (error: any) {
        response.message = `Fail adding product:${product.name}`;
        response.error = error.message || error;
      }
      responses.push(response);
    }

    return res.json({
      message: 'Successful messages added',
      data: responses
    });
  } catch (error) {
    return next(error);
  }
};
