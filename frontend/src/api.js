const BASE_URL = "http://127.0.0.1:8000";

// ✅ TOKEN HELPER
function getToken() {
  return localStorage.getItem("token");
}

// ✅ Signup
export async function signup(email, password) {
  const res = await fetch("http://127.0.0.1:8000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })   // ✅ ONLY these two
  });

  return res.json();
}




// ✅ Login
export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// ✅ Chat with AI
export async function chat(user_id, message) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, message }),
  });
  return res.json();
}

// ✅ Save Journal ✅✅✅ (THIS WAS MISSING BEFORE)
export async function journal(user_id, message) {
  const res = await fetch(`${BASE_URL}/journal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, message }),
  });
  return res.json();
}

export const fetchJournals = async (userId) => {
  const res = await fetch(`http://127.0.0.1:8000/journal/${userId}`);
  return res.json();
};

