import IVotes from './IVote';

interface IProduct {
    id: string,
    sku: string,
    name: string,
    price: number,
    stock?: number,
    category?: string,
    tags?: string[],
    description?: string,
    extraInfo?: string,
    feedback?: IVotes,
    images?: string[]
}
export default IProduct;
