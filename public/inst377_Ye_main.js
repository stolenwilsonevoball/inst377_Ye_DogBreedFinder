async function checkServerStatus() {
  const statusText = document.querySelector('#server-status');

  if (!statusText) {
    return;
  }

  try {
    const response = await fetch('/api/health');
    const data = await response.json();

    statusText.textContent = `${data.project} backend is ${data.status}.`;
  } catch (error) {
    statusText.textContent = 'Backend is not responding right now.';
  }
}

checkServerStatus();
