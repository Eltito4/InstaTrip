import React, { useState } from 'react';
import SimpleLanding from './src/screens/SimpleLanding';
import SimpleHome from './src/screens/SimpleHome';

export default function App() {
  console.log('=== APP SIN REACT NAVIGATION ===');
  const [user, setUser] = useState(null);

  if (!user) {
    return <SimpleLanding onLogin={setUser} />;
  }

  return <SimpleHome user={user} onLogout={() => setUser(null)} />;
}
