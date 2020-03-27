'use strict';

module.exports = class Product {
    constructor(id, description, price) {
        this.id = id;
        this.description = description;
        this.price = price;
    }

    toPersistency(template) {
        return Object.assign(template, {
            'product_id': this.id,
            'description': this.description,
            'price': this.price
        });
    }

    static fromDynamo = (p) => new Product(
        p.id.S,
        p.description.S,
        p.price.N
    );
};