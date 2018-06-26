function loadPage(){
    generateYears()
    setFocus('fName')
}

function addPhoneDashes(f) {
    f.value = f.value.replace(/\D/g, '');
    if(f.value.length > 3)
        f.value = '(' + f.value.slice(0,3) + ") " + f.value.slice(3,13);
    if(f.value.length > 9)
        f.value = f.value.slice(0,9) + "-" + f.value.slice(9,13);
}

function validate() {
    var invalidField = noState()
    invalidField = noText('city')     || invalidField
    invalidField = noText('address')  || invalidField
    invalidField = phoneNumberIsBad() || invalidField
    invalidField = noText('lName')    || invalidField
    invalidField = noText('fName')    || invalidField
    if (invalidField) invalidField.focus()
    return !invalidField
}

function setFocus(id){
	document.getElementById(id).focus()
}

function phoneNumberIsBad() {
    var result
    var input = document.getElementById('phone')
    var phoneNumber = input.value.replace(/\D/g, '')
    input.style.borderColor = ''
    if (phoneNumber.length !== 10){
        input.style.borderColor = '#f44242'
        result = input
    }
    return result
}

function noText(id){
    var result
    var input = document.getElementById(id)
    input.style.borderColor = ''
    if (input.value === ''){
        input.style.borderColor = '#f44242'
        result = input
    }
    return result
}

function noState(){
    var result
    var state = document.getElementById('state')
    if (state.options[state.selectedIndex].text === '-State-'){
        state.style.borderColor = '#f44242'
        result = state
    }
    else
        state.style.borderColor = ''
    return result
}

function addToCart(sid) {
    $.post("in-cart.php", {id : sid} );
}

function removeFromCart(sid) {
	$.ajax({
		type: "POST",
		url: "out-cart.php",
		data: { "id": sid },
		success: function() {
			location.reload()
		}
	})
}
