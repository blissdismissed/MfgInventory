const stripe = require('stripe')('sk_test_51L8xqMCoDMUGd4JoTzQNEmBibTiXrisrHaVmcRatGcRXGJn9mIVIcLVn4yHwRNiVAxsHVCK2u20kLYtxMUO36zH800JTj7QvPR');

const Order = require('../models/order.model');
const User = require('../models/user.model');

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', { orders: orders});
  } catch(error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
  userDocument = await User.findById(res.locals.uid);
  console.log("userDocument in addOrder: ", userDocument);
  } catch(error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);
  console.log("order: ", order);

  try {
    await order.save();

  } catch(error) {
    next(error);
    return;
  }

  req.session.cart = null;

  // Stripe action for checkout
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'dummy',
          },
          unit_amount_decimal: 10.99 
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `localhost:3000/orders/success`,
    cancel_url: `localhost:3000/orders/failure`,
  });

  res.redirect(303, session.url);
}

function getSuccessPage(req, res) {
  res.render('customer/orders/success');
}

function getFailurePage(req, res) {
  res.render('customer/orders/failure');
}


module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccessPage: getSuccessPage,
  getFailurePage: getFailurePage,
}