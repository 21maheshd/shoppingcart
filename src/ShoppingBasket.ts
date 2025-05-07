export enum ItemName {
    Apple = "Apple",
    Banana = "Banana",
    Melon = "Melon",
    Lime = "Lime"
}

// PriceProvider interface for getting item prices
interface PriceProvider {
    getPrice(item: ItemName): number;
}

// implementation of PriceProvider
export class StaticPriceProvider implements PriceProvider {
    private prices: Record<ItemName, number> = {
        [ItemName.Apple]: 35,
        [ItemName.Banana]: 20,
        [ItemName.Melon]: 50,
        [ItemName.Lime]: 15
    };

    getPrice(item: ItemName): number {
        return this.prices[item];
    }
}

// Offer interface
interface Offer {
    apply(count: number, price: number): number;
}

// implementation of Buy1Get1 offer
export class Buy1Get1 implements Offer {
    apply(count: number, price: number): number {
        return Math.floor(count / 2) * price + (count % 2) * price;
    }
}

// implementation of Buy2Get3 offer
export class Buy2Get3 implements Offer {
    apply(count: number, price: number): number {
        return Math.floor(count / 3) * 2 * price + (count % 3) * price;
    }
}

// OfferFactory to create offers based on item type
export class OfferFactory {
    static getOffer(item: ItemName): Offer | null {
        switch (item) {
            case ItemName.Melon:
                return new Buy1Get1();
            case ItemName.Lime:
                return new Buy2Get3();
            default:
                return null;
        }
    }
}

export class ShoppingBasket {
    private items: ItemName[];
    private priceProvider: PriceProvider;

    constructor(items: ItemName[], priceProvider: PriceProvider) {
        this.items = items;
        this.priceProvider = priceProvider;
        console.log('Added items', this.items);
    }

    public calculateTotalCost(): number {
        const itemCounts: Record<ItemName, number> = {} as Record<ItemName, number>;

        for (const item of this.items) {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        }

        let totalCost = 0;

        for (const item in itemCounts) {
            const count = itemCounts[item as ItemName];
            const price = this.priceProvider.getPrice(item as ItemName);
            const offer = OfferFactory.getOffer(item as ItemName);

            if (offer) {
                totalCost += offer.apply(count, price);
            } else {
                totalCost += count * price;
            }
        }

        return totalCost;
    }
}

// Calling functions
const priceProvider = new StaticPriceProvider();
const basket = new ShoppingBasket([
    ItemName.Apple, ItemName.Apple, ItemName.Banana,
    ItemName.Melon, ItemName.Melon,
    ItemName.Lime, ItemName.Lime, ItemName.Lime
], priceProvider);

console.log(`Total cost: ${basket.calculateTotalCost()}p`);
