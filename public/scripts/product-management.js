const deleteProductButtonElements = document.querySelectorAll('.product-item button');

async function deleteProduct(event) {
  const buttonElement = event.target;
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrftoken;

  const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, {
    method: 'DELETE',
  });

  if(!response.ok) {
    alert('Something went wrong in the deletion of that item.');
    return;
  } 

  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct);
}


