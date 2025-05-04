export enum ItemName {
    Apple = "Apple",
    Banana = "Banana",
    Melon = "Melon",
    Lime = "Lime"
}
export class Offers {
    static Buy1Get1(totalCost: number, count: number, price: number) {
        totalCost += Math.floor(count / 2) * price;
        totalCost += (count % 2) * price
        return totalCost;
    }
    static Buy2Get3(totalCost: number, count: number, price: number) {
        totalCost += Math.floor(count / 3) * 2 * price;
        totalCost += (count % 3) * price
        return totalCost;
    }
}

export class ShoppingBasket {
    private items: ItemName[];

    constructor(items: ItemName[]) {
        this.items = items;
        console.log('Added items', this.items);
    }

    private static prices: Record<ItemName, number> = {
        [ItemName.Apple]: 35,
        [ItemName.Banana]: 20,
        [ItemName.Melon]: 50,
        [ItemName.Lime]: 15
    };

    public calculateTotalCost(): number {
        const itemCounts: Record<ItemName, number> = {} as Record<ItemName, number>;

        for (const item of this.items) {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        }

        let totalCost = 0;

        for (const item in itemCounts) {
            const count = itemCounts[item as ItemName];

            switch (item as ItemName) {
                case ItemName.Melon:
                    console.log('Melons are available as buy one get one free')
                    totalCost = Offers.Buy1Get1(totalCost, count, ShoppingBasket.prices[item as ItemName])
                    break;
                case ItemName.Lime:
                    console.log('Limes are available in a three for the price of two offer')
                    totalCost = Offers.Buy2Get3(totalCost, count, ShoppingBasket.prices[item as ItemName])
                    break;
                default:
                    totalCost += count * ShoppingBasket.prices[item as ItemName];
                    break;
            }
        }

        return totalCost;
    }
}


// Calling functions
const basket = new ShoppingBasket([
    ItemName.Apple, ItemName.Apple, ItemName.Banana,
    ItemName.Melon, ItemName.Melon,
    ItemName.Lime, ItemName.Lime, ItemName.Lime
]);
console.log(`Total cost: ${basket.calculateTotalCost()}p`);
