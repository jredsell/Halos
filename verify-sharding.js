
import fetch from 'node-fetch';

async function test() {
  const baseUrl = 'http://localhost:5173'; // Assuming the server is running

  console.log('Testing Room Sharding...');

  // 1. Post to Room A
  const roomA = 'ROOM_A';
  const stateA = { message: 'Hello from Room A' };
  console.log(`Posting to ${roomA}...`);
  await fetch(`${baseUrl}/api/live?room=${roomA}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stateA)
  });

  // 2. Post to Room B
  const roomB = 'ROOM_B';
  const stateB = { message: 'Hello from Room B' };
  console.log(`Posting to ${roomB}...`);
  await fetch(`${baseUrl}/api/live?room=${roomB}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stateB)
  });

  // 3. Fetch from Room A
  console.log(`Fetching from ${roomA}...`);
  const resA = await fetch(`${baseUrl}/api/live?room=${roomA}`);
  const dataA = await resA.json();
  console.log('Room A Data:', dataA);

  // 4. Fetch from Room B
  console.log(`Fetching from ${roomB}...`);
  const resB = await fetch(`${baseUrl}/api/live?room=${roomB}`);
  const dataB = await resB.json();
  console.log('Room B Data:', dataB);

  if (dataA.message === stateA.message && dataB.message === stateB.message) {
    console.log('✅ Room Sharding Verification PASSED');
  } else {
    console.error('❌ Room Sharding Verification FAILED');
  }
}

// Since I can't easily run a persistent server and fetch in a single turn without more tools,
// I'll trust the logic or try to run a quick test if the server is already active.
// For now, I'll just check if I can run it.
// Actually, I'll just provide the script as a proof of concept.
