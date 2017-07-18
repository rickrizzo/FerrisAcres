var orderForm = null;
var orderCount = 1;

$('#addFlavor').click(function(event) {
  event.preventDefault();
  orderCount ++;
  $('#orderForm').append($('.row').first().clone());
  $('.row h4').last().text('Flavor ' + orderCount);
});
