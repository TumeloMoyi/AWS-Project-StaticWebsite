const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", function(event) {

  event.preventDefault();

  alert("Reservation submitted successfully!");

  bookingForm.reset();

});