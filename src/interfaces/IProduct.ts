import IVotes from './IVote';

export interface ISimpleProduct {
    id?: any,
    sku: string,
    name: string,
    price: number,
}

export interface ISaleProduct extends ISimpleProduct {
    quantity: number
}

interface IProduct extends ISimpleProduct {
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
