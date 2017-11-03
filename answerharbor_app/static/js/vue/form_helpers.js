function preventFormSubmit(form, event) {
    form.setInvalidState();
    event.preventDefault();
}
