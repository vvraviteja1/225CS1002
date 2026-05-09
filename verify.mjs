// verify.mjs — Get auth token

const response = await fetch(
  "http://4.224.186.213/evaluation-service/auth",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "225cs1002@iiitk.ac.in",         // ← your college email
      name: "V.V.RAVI TEJA",                 // ← your real name
      rollNo: "225CS1002",               // ← your roll number
      accessCode: "uZySAT",    // ← from affordmed email
      clientID: "bbadc209-dd39-46d1-ba34-f0e2240f9415",        // ← your saved clientID
      clientSecret: "VthDuuxaEfxbwsHj" // ← your saved clientSecret
    }),
  }
);

const data = await response.json();
console.log("Full Response:", JSON.stringify(data, null, 2));
console.log("\n Your Token:");
console.log(data.access_token);