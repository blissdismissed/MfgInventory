const db = require("../data/database");

class Order {
  // Status => pending, fulfilled, cancelled
  constructor(cart, userData, status = "pending", date, orderId) {
    // 2022-05-01
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
    this.id = orderId;
  }

  static transformOrderDocument(orderDoc) {
    return new Order {
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id,
    };
  }

  static transformOrderDocuments(orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
  }

  save() {
    if (this.id) {
      // Updating
    } else {
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status
      };

      return db
        .getDb()
        .collection("orders")
        .insertOne(orderDocument);
    }
  }

  static async findAll() {
    const orders = await db
      .getDb()
      .collection("orders")
      .find()
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findAllForUser(userId) {
    const uid = new monogodb.ObjectId(userId);

    const orders = await db
      .getDb()
      .collection("orders")
      .find({ "userData._uid": uid })
      .sort({ _uid: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findById(orderId) {
    const order = await db
    .getDb()
    .collection("orders")
    .findOne({ _id: new mongodb.ObjectId(orderId) });

  return this.transformOrderDocuments(order);
  }
}

module.exports = Order;
