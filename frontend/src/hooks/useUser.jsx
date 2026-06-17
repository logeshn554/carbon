import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

const USER_STORAGE_KEY = 'ecoguide_anon_id';

/**
 * Generates or retrieves a persistent anonymous user ID.
 * No login, no email, no password — just a UUID tied to the browser.
 */
function getOrCreateAnonId() {
  let id = localStorage.getItem(USER_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_STORAGE_KEY, id);
  }
  return id;
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getOrCreateAnonId();
    setUser({ id, name: 'Anonymous' });
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
