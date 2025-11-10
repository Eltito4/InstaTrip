import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Landing from './Landing.jsx';
import App from './App.jsx';

function Main() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Landing onLogin={setUser} />;
  }

  return <App user={user} onLogout={() => setUser(null)} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
