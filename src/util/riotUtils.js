export async function login(username, password) {
  const res = await fetch('/rankData', 
  {
    method: 'POST', 
    headers: {
      'Content-Type' : 'application/json',
      'Accept' : '*/*'
    },
    body: JSON.stringify({
    username,
    password
  })});

  return await res.json();
};
