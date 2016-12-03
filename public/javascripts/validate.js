$(function() {
  $("form[name='cakeorder']").validate({
    rules: {
      name: "required",
      phone: {
        required: true,
        step: 10
      },
      email: {
        required: true,
        email: true
      },
    },
    messages: {
      name: "Please enter your firstname",
      phone: "Please enter your phone number (ex. 8880001234)",
      email: "Please enter a valid email address"
    },
    submitHandler: function(form) {
      form.submit();
    }
  });
});
