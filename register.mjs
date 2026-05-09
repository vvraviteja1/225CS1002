// register.mjs — Run ONCE to get your clientID and clientSecret
// node register.mjs

const response = await fetch(
  "http://4.224.186.213/evaluation-service/register",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "225cs1002@iiitk.ac.in",       // ← your college email
      name: "V.V.RAVI TEJA",               // ← your real name
      mobileNo: "9398601304",          // ← your mobile number
      githubUsername: "vvraviteja1",     // ← your github username
      rollNo: "225CS1002",             // ← your roll number
      accessCode: "uZySAT", // ← from the email you received
    }),
  }
);

const data = await response.json();
console.log("Registration Response:");
console.log(JSON.stringify(data, null, 2));
console.log("\n SAVE THESE:");
console.log("clientID     →", data.clientID);
console.log("clientSecret →", data.clientSecret);