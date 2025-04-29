let x = 0;
const login = function name(email, password) {
    x = x + 1;
    console.log("Login attempt number: " + x);
    if (email === "admin" && password === "admin") {
        console.log("Login successful!");
        return true;
    } else {
        console.log("Login failed!");
        return false;
    }
}