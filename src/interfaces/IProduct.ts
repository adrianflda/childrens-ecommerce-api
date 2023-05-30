import IVotes from './IVote';

interface IProduct {
    id?: any,
    sku: string,
    name: string,
    price: number,
    stock?: number,
    category?: string,
    tags?: string[],
    description?: string,
    extraInfo?: string,
    // TODO this field should move to use a different collection Votes
    feedBack?: IVotes,
    images?: string[]
}
export default IProduct;
