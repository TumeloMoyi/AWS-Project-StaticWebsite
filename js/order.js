const orderForm = document.getElementById("orderForm");

orderForm.addEventListener("submit", function(event) {

  event.preventDefault();

  alert("Order submitted successfully!");

  orderForm.reset();

});