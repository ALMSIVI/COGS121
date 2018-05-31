'use strict';

/** This function ensures that ALL fields are nonempty. */
function validate(formId, messageId) {
  let validated = true;
  $(messageId).html('');
  $(formId + ' :input').each((index, element) => {
    $(element).removeClass('validate-error');
    if (element.value === '') { // empty
      const name = element.name;
      $(messageId).append(name + ' is required.');
      $(element).addClass('validate-error');
      validated = false;
    }
  });
  return validated;
}

/** This function ensures that AT LEAST ONE field is nonempty. */
function validateWeak(formId, messageId) {
  let validated = false;
  $(messageId).html('');
  $(formId + ' :input').each((index, element) => {
    if (element.value !== '') { // empty
      validated = true;
    }
  });
  if (!validated) {
    $(messageId).append('Please enter at least ONE field!');
  }
  return validated;
}