import IProduct, { ISaleProduct } from './IProduct';
import { ISimpleUser } from './IUser';

export interface ISalesResponse {
    totalSales: number,
    totalProducts: number,
    products: IProduct[]
}

interface ISaleOrder {
    id?: any,
    code: string,
    user: ISimpleUser,
    products: ISaleProduct[]
};
export default ISaleOrder;
