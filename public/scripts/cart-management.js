const addToCartButtonElement = document.querySelector(
  "#product-details button"
);
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

async function addToCart() {
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrftoken;

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-type": "application/json"
      }
    });
  } catch (error) {
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  const responseData = await response.json();
  const newTotalQuantity = responseData.newTotalItems;

  for ( badgeElement of cartBadgeElements) {
    badgeElement.textContent = newTotalQuantity;
  }
  
}

addToCartButtonElement.addEventListener("click", addToCart);
