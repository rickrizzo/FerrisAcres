// Initialize Document
$(document).ready(function(){
    setFlavorOptions()
});

// Listen for Changes
$('select[name="type"]').change(function() {
  setFlavorOptions()
});

function setFlavorOptions() {
  if ($('select[name="type"]').val() == 'Premium') {
    $('select[name="flavor_one"]').prop('disabled', false);
    $('select[name="flavor_two"]').prop('disabled', false);
    $('.notice').show();
  }
  if ($('select[name="type"]').val() == 'Basic') {
    $('select[name="flavor_one"]').val('Vanilla');
    $('select[name="flavor_one"]').prop('disabled', true);
    $('select[name="flavor_two"]').val('Chocolate');
    $('select[name="flavor_two"]').prop('disabled', true);
    $('.notice').hide();
  }
}