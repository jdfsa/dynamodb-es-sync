module.exports = class Product {
    constructor(id, description, price) {
        this.id = id;
        this.description = description;
        this.price = price;
    }

    static fromDynamo = (p) => new Product(
        p.id.S,
        p.description.S,
        p.price.N
    );
};