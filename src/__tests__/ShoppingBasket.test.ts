import { ItemName, Offers, ShoppingBasket } from "../../src/ShoppingBasket";

describe('Offers', () => {
    test('Buy1Get1 should apply buy-one-get-one-free logic', () => {
        expect(Offers.Buy1Get1(0, 2, 50)).toBe(50);
        expect(Offers.Buy1Get1(0, 3, 50)).toBe(100);
        expect(Offers.Buy1Get1(0, 5, 50)).toBe(150);
    });

    test('Buy2Get3 should apply buy-two-get-three logic', () => {
        expect(Offers.Buy2Get3(0, 3, 15)).toBe(30);
        expect(Offers.Buy2Get3(0, 4, 15)).toBe(45);
        expect(Offers.Buy2Get3(0, 6, 15)).toBe(60);
    });
});

describe('ShoppingBasket', () => {
    test('should return 0 for an empty basket', () => {
        const basket = new ShoppingBasket([]);
        expect(basket.calculateTotalCost()).toBe(0);
    });

    test('should correctly calculate cost without offers', () => {
        const basket = new ShoppingBasket([
            ItemName.Apple, ItemName.Banana
        ]);
        expect(basket.calculateTotalCost()).toBe(35 + 20);
    });

    test('should apply Buy1Get1 offer on melons', () => {
        const basket = new ShoppingBasket([
            ItemName.Melon, ItemName.Melon
        ]);
        expect(basket.calculateTotalCost()).toBe(50); // one free
    });

    test('should apply Buy2Get3 offer on limes', () => {
        const basket = new ShoppingBasket([
            ItemName.Lime, ItemName.Lime, ItemName.Lime
        ]);
        expect(basket.calculateTotalCost()).toBe(30); // 3 for price of 2
    });

    test('should calculate mixed basket correctly', () => {
        const basket = new ShoppingBasket([
            ItemName.Apple, ItemName.Apple, ItemName.Banana,
            ItemName.Melon, ItemName.Melon,
            ItemName.Lime, ItemName.Lime, ItemName.Lime
        ]);
        // Apples: 2 * 35 = 70
        // Banana: 1 * 20 = 20
        // Melons Buy 1 get 1: 2 = 50
        // Limes Buy 2 get 3: 3 = 30
        const expectedTotal = 70 + 20 + 50 + 30;
        expect(basket.calculateTotalCost()).toBe(expectedTotal);
    });
});
