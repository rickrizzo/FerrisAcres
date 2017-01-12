var orderForm = null;

$('#addFlavor').click(function(event) {
  event.preventDefault();
  $('#orderForm').append($('.row').first().clone());
});
