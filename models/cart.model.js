const Product = require('./product.model');

class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  addItems(product) {
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price
    };

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.product.id === product.id) {
        cartItem.quantity = +item.quantity + 1;
        cartItem.totalPrice = item.totalPrice + product.price;
        this.items[i] = cartItem;

        this.totalQuantity++;
        this.totalPrice += product.price;
        return;
      }
    }

    this.items.push(cartItem);
    this.totalQuantity++;
    this.totalPrice += product.price;
  }

  updateItem(productId, newQuantity) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.product.id === productId && newQuantity > 0) {
        const cartItem = { ...item };
        const quantityChange = newQuantity - item.quantity;
        cartItem.quantity = newQuantity;
        cartItem.totalPrice = newQuantity * item.product.price;
        this.items[i] = cartItem;

        this.totalQuantity = this.totalQuantity + quantityChange;
        this.totalPrice += quantityChange * item.product.price;
        return { updatedItemPrice: cartItem.totalPrice };
      } else if (item.product.id === productId && newQuantity <= 0) {
        this.items.splice(i, 1);
        this.totalQuantity = this.totalQuantity - item.quantity;
        this.totalPrice -= item.totalPrice;
        return { updatedItemPrice: 0 };
      }
    }
  }

  async updatePrices(){
    const productIds = this.items.map(item => item.product.id);

    const products = await Product.findMultiple(productIds);

    const deleteableCartItemProductIds = [];

    for ( const cartItem of this.items) {
      const product = products.find( prod => prod.id === cartItem.product.id );

      if (!product) {
        // product was deleted
        // 'schedule' for removal from cart
        deleteableCartItemProductIds.push(cartItem.product.id);
        continue;
      }

      // product still there
      // set product data and price to latest from the database
      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }

    if ( deleteableCartItemProductIds.length > 0 ) {
      this.items = this.items.filter( item => productIds.indexOf(item.product.id) < 0);
    }

    // re-calculate cart toals
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const item of this.items) {
      this.totalQuantity += item.quantity;
      this.totalPrice += item.totalPrice;
    } 

  }
}

module.exports = Cart;
