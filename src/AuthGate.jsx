import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export default function AuthGate({ children }) {
  const [user, setUser] = useState(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  const login = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (user === undefined) {
    return (
      <div style={styles.centerWrap}>
        <div style={styles.card}>Checking authentication…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.centerWrap}>
        <div style={styles.card}>
          <h1 style={styles.h1}>MC DS Timeline</h1>
          <p style={styles.sub}>Sign in to continue</p>
          <button onClick={login} disabled={loading} style={styles.btn}>
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
          {error ? <p style={styles.error}>{error}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={styles.userBar}>
        <span style={styles.userText}>{user.email}</span>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>
      {children}
    </>
  );
}

const styles = {
  centerWrap: {
    width: "100%",
    height: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#0b1220",
    color: "#e5e7eb",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  card: {
    width: "min(420px, 92vw)",
    background: "#121a2b",
    border: "1px solid #24324b",
    borderRadius: 14,
    padding: 24,
    textAlign: "center",
  },
  h1: { margin: 0, fontSize: 24 },
  sub: { color: "#93a3bc", marginTop: 8, marginBottom: 18 },
  btn: {
    width: "100%",
    border: "none",
    borderRadius: 10,
    padding: "10px 12px",
    background: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  error: { marginTop: 12, color: "#fca5a5", fontSize: 13 },
  userBar: {
    position: "fixed",
    top: 8,
    right: 8,
    zIndex: 9999,
    display: "flex",
    gap: 8,
    alignItems: "center",
    background: "rgba(15,23,42,0.92)",
    color: "#e5e7eb",
    border: "1px solid rgba(148,163,184,0.35)",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
  },
  userText: { opacity: 0.9 },
  logoutBtn: {
    border: "1px solid rgba(148,163,184,0.35)",
    background: "transparent",
    color: "#e5e7eb",
    borderRadius: 999,
    padding: "4px 10px",
    fontSize: 12,
    cursor: "pointer",
  },
};
