//VALIDATE USERNAME
let nameAlphanum = false;
document.getElementById("username").addEventListener("input", function(event) {
    const input = event.target.value;
    validateRequirement("name-begins", input.match(/^[a-zA-Z]/),false);

    let alphanumCharCount = 0;
    for(let char of input) {
        if(char.match(/[a-zA-Z0-9]/)) { alphanumCharCount++; }
        if(alphanumCharCount >= 3) {
            break;
        }
    }
    validateRequirement("name-alphanum",alphanumCharCount >= 3,false);
    //updateInputStrengthText();
    // document.getElementById("registration-input-strength").classList.toggle("input-strength-hidden");
})
let totalStrength = 0;
let passwordStrength = 0;
function validateRequirement(id, condition, validatingPassword) {
    let element = document.getElementById(id).classList;
    if(condition) {
        totalStrength += element.contains("requirement-met")?0:1;
        passwordStrength += !validatingPassword||element.contains("requirement-met")?0:1;
        element.add("requirement-met");
    } else {
        totalStrength -= element.contains("requirement-met")?1:0;
        passwordStrength -= validatingPassword&&element.contains("requirement-met")?1:0;
        element.remove("requirement-met");
    }
    document.getElementById("registration-submit").disabled = totalStrength < 7;
}
//VALIDATE PASSWORD
let password = "";
document.getElementById("password").addEventListener("input", function(event) {
    password = event.target.value;
    validateRequirement("pass-length", password.length >= 8,true);
    validateRequirement("pass-uppercase",password.match(/[A-Z]/),true);
    validateRequirement("pass-number",password.match(/[0-9]/),true);
    validateRequirement("pass-special",password.match(/[\/*\-+!@#$^&~[\]]/),true);
    validateRequirement("pass-confirm",password.length > 0 && password === confirmPassword,true);
    updateStrength();
})
let confirmPassword = "";
document.getElementById("confirmPassword").addEventListener("input", function(event) {
    confirmPassword = event.target.value;
    console.log(password.length);
    validateRequirement("pass-confirm",password.length > 0 && password === confirmPassword,true);
    updateStrength();
})
//PASSWORD STRENGTH
const strengthStrings = ["Pathetic","Still Pretty Bad","Better","Actually Pretty Good","Near Perfection","GODLIKE"];
const strengthColours = ["red","orange","var(--minty-green)","var(--minty-blue)","#9f41d1","#ffff52"];
updateStrength();
function updateStrength() {
    document.getElementById("strength-description").textContent = strengthStrings[passwordStrength];
    document.getElementById("progress").style.width = passwordStrength*19+5+"%";
    document.getElementById("progress").style.background = strengthColours[passwordStrength] ;
}
//TOGGLE INPUT VALIDATION MENU
const ids = ["username","password","confirmPassword"];
for(i = 0; i < 2*ids.length; i++) {
    document.getElementById(ids[i%ids.length]).addEventListener(i%2===0?"focusin":"focusout", function(){
        document.getElementById("registration-input-strength").classList.toggle("input-strength-hidden");
    })
}
//REGISTRATION SUBMISSION
document.getElementById("registration-form").addEventListener("submit", function(event) {
    console.log("yoyoyo!");
    if(totalStrength >= 7){
        event.target.submit();
        // document.getElementById("registration-submit")
    }
    event.preventDefault();
})
