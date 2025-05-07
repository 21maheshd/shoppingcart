import { ItemName, ShoppingBasket, StaticPriceProvider, Buy1Get1, Buy2Get3, OfferFactory } from '../ShoppingBasket';

// PriceProvider tests
describe('StaticPriceProvider', () => {
    let priceProvider: StaticPriceProvider;

    beforeEach(() => {
        priceProvider = new StaticPriceProvider();
    });

    test('should return correct prices for items', () => {
        expect(priceProvider.getPrice(ItemName.Apple)).toBe(35);
        expect(priceProvider.getPrice(ItemName.Banana)).toBe(20);
        expect(priceProvider.getPrice(ItemName.Melon)).toBe(50);
        expect(priceProvider.getPrice(ItemName.Lime)).toBe(15);
    });
});

// Buy1Get1 offer tests
describe('Buy1Get1 Offer', () => {
    let offer: Buy1Get1;

    beforeEach(() => {
        offer = new Buy1Get1();
    });

    test('calculates price correctly for even count', () => {
        expect(offer.apply(4, 50)).toBe(2 * 50); // 4 items, pay for 2
    });

    test('calculates price correctly for odd count', () => {
        expect(offer.apply(5, 50)).toBe(3 * 50); // 5 items, pay for 3
    });

    test('calculates zero price for zero count', () => {
        expect(offer.apply(0, 50)).toBe(0);
    });
});

// Buy2Get3 offer tests
describe('Buy2Get3 Offer', () => {
    let offer: Buy2Get3;

    beforeEach(() => {
        offer = new Buy2Get3();
    });

    test('calculates price correctly for multiples of 3', () => {
        expect(offer.apply(3, 15)).toBe(2 * 15); // 3 items, pay for 2
        expect(offer.apply(6, 15)).toBe(4 * 15); // 6 items, pay for 4
    });

    test('calculates price correctly for non-multiples of 3', () => {
        expect(offer.apply(4, 15)).toBe(2 * 15 + 1 * 15); // 3-for-2 + 1 normal = 3*price = 45
        expect(offer.apply(5, 15)).toBe(4 * 15);           // 3-for-2 + 2 normal = 4*price = 60
    });

    test('calculates zero price for zero count', () => {
        expect(offer.apply(0, 15)).toBe(0);
    });
});

// OfferFactory tests
describe('OfferFactory', () => {
    test('returns Buy1Get1 for Melon', () => {
        const offer = OfferFactory.getOffer(ItemName.Melon);
        expect(offer).toBeInstanceOf(Buy1Get1);
    });

    test('returns Buy2Get3 for Lime', () => {
        const offer = OfferFactory.getOffer(ItemName.Lime);
        expect(offer).toBeInstanceOf(Buy2Get3);
    });

    test('returns null for items without offers', () => {
        expect(OfferFactory.getOffer(ItemName.Apple)).toBeNull();
        expect(OfferFactory.getOffer(ItemName.Banana)).toBeNull();
    });
});

// ShoppingBasket integration tests
describe('ShoppingBasket', () => {
    let priceProvider: StaticPriceProvider;

    beforeEach(() => {
        priceProvider = new StaticPriceProvider();
    });

    test('calculates total cost without offers correctly', () => {
        const basket = new ShoppingBasket(
            [ItemName.Apple, ItemName.Banana],
            priceProvider
        );
        const total = basket.calculateTotalCost();
        expect(total).toBe(35 + 20);
    });

    test('applies Buy1Get1 offer for Melons correctly', () => {
        const basket = new ShoppingBasket(
            [ItemName.Melon, ItemName.Melon, ItemName.Melon], // 3 melons
            priceProvider
        );
        // 3 melons, pay 2 * 50 = 100
        expect(basket.calculateTotalCost()).toBe(2 * 50);
    });

    test('applies Buy2Get3 offer for Limes correctly', () => {
        const basket = new ShoppingBasket(
            [ItemName.Lime, ItemName.Lime, ItemName.Lime, ItemName.Lime], // 4 limes
            priceProvider
        );
        // 3 for price of 2 + 1 normal: 2*15 + 1*15 = 45
        expect(basket.calculateTotalCost()).toBe(45);
    });

    test('calculates total cost for mixed items correctly', () => {
        const items = [
            ItemName.Apple, ItemName.Apple, ItemName.Banana,
            ItemName.Melon, ItemName.Melon,
            ItemName.Lime, ItemName.Lime, ItemName.Lime
        ];
        const basket = new ShoppingBasket(items, priceProvider);
        /* Calculation:
           Apple: 2 * 35 = 70
           Banana: 1 * 20 = 20
           Melon: 2 items, Buy1Get1 => pay for 1 * 50 = 50
           Lime: 3 items, Buy2Get3 => pay for 2 * 15 = 30
           Total: 70 + 20 + 50 + 30 = 170
        */
        expect(basket.calculateTotalCost()).toBe(170);
    });
});
