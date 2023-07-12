//REGISTRATION REQUIREMENTS
document.getElementById("username").addEventListener("input", function(event) {
    const input = event.target.value;
    if(input.match(/^[a-zA-Z]/)) {
        //begins w/ a letter
    }

    let alphanumCharCount = 0;
    for(let char of input) {
        if(char.match(/[a-zA-Z0-9]/)) { alphanumCharCount++; }
        if(alphanumCharCount >= 3) {
            //3+ alphanum characters
            break;
        }
    }
    document.getElementById("registration-input-strength").classList.toggle("input-strength-hidden");
})
let password;
document.getElementById("password").addEventListener("input", function(event) {
    password = event.target.value;
    if(password.length >= 8) {
        //8+ characters
    }
    if(password.match(/[A-Z]/)) {
        //at least 1 uppercase
    }
    if(password.match(/[0-9]/)) {
        //at least 1 number
    }
    if(password.match(/[\/*\-+!@#$^&~[\]]/)) {
        //at least 1 special character
    }
    comparePassword();
})
let confirmPassword;
document.getElementById("confirmPassword").addEventListener("input", function(event) {
    confirmPassword = event.target.value;
    comparePassword();
})
function comparePassword() {
    console.log(password === confirmPassword);
}
//INPUT STRENGTH
//REGISTRATION SUBMISSION
document.getElementById("registration-form").addEventListener("submit", function(event) {
    if(false){
        event.target.submit();
    }
    event.preventDefault();
})
