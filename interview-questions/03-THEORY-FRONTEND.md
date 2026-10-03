# ⚛️ 03 — Frontend Theory: React.js

> Learn React from scratch with examples from your QuickFixRide project.

---

## SECTION 1: What is React?

React is a **JavaScript library** (made by Facebook/Meta) for building user interfaces.

### The Problem React Solves

**Before React** (pure HTML + JavaScript):
- When data changes, you manually update the DOM: `document.getElementById('name').innerText = newName`
- For complex apps with many updates, this becomes a mess
- Performance issues — you manually manage everything

**With React:**
- You describe **what the UI should look like** based on data (state)
- React automatically updates the screen when data changes
- No manual DOM manipulation needed!

### Virtual DOM

React uses a **Virtual DOM** — a JavaScript copy of the actual DOM.

```
Step 1: State changes (e.g., user logs in)
Step 2: React creates new Virtual DOM
Step 3: React compares new vs old Virtual DOM (diffing)
Step 4: React updates ONLY the changed parts in the real DOM
Result: Super fast — minimal DOM operations
```

---

## SECTION 2: Components

A **Component** is a reusable piece of UI — like a Lego block.

Your project's components:
- `<Navbar />` — Navigation bar (used on every page)
- `<Footer />` — Footer (used on every page)
- `<ProtectedRoute />` — Wraps protected pages
- `<Chatbot />` — AI chatbot widget

Your project's pages (also components):
- `<Home />`, `<Login />`, `<Signup />`, `<Dashboard />`, etc.

### Functional Components (What React uses today)

```jsx
// A simple component
const Navbar = () => {
  return (
    <nav>
      <h1>QuickFixRide</h1>
    </nav>
  );
};

export default Navbar;
```

**Rules:**
1. Component names must start with a capital letter
2. Must return JSX (or null)
3. Should be in its own file (good practice)

---

## SECTION 3: JSX — HTML in JavaScript

**JSX** = JavaScript XML — lets you write HTML-like code inside JavaScript.

### JSX vs HTML — Key Differences

| HTML | JSX |
|------|-----|
| `class="..."` | `className="..."` |
| `for="..."` | `htmlFor="..."` |
| `onclick="..."` | `onClick={...}` |
| Self-closing: `<input>` | Must close: `<input />` |
| Inline style: `style="color: red"` | `style={{ color: 'red' }}` |

### JavaScript inside JSX

Use `{}` to write JavaScript expressions inside JSX:

```jsx
const name = "Yatharth";
const isLoggedIn = true;

return (
  <div>
    <h1>Hello, {name}!</h1>           {/* Variable */}
    <p>{2 + 2}</p>                     {/* Expression */}
    {isLoggedIn && <button>Logout</button>}  {/* Conditional */}
    {isLoggedIn ? <p>Welcome</p> : <p>Please login</p>}  {/* Ternary */}
  </div>
);
```

### Lists in JSX — `.map()`

To render a list of items, use `.map()`:

```jsx
// From Dashboard.jsx
{profiles.map(profile => (
  <tr key={profile.id}>
    <td>{profile.name}</td>
    <td>{profile.email}</td>
  </tr>
))}
```

**Important:** Always add a `key` prop when mapping — React uses it to track items.

---

## SECTION 4: Props

**Props** (Properties) = Data passed from a parent component to a child.

```jsx
// Parent passes props
<Placeholder title="Quick Fix Ride Blog" />

// Child receives props
const Placeholder = ({ title }) => (
  <div>
    <h1>{title}</h1>
  </div>
);
```

**Props are read-only** — a child cannot modify its props.

### `children` Prop — Special Prop

```jsx
// ProtectedRoute uses the children prop
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;   // Renders whatever is inside <ProtectedRoute>...</ProtectedRoute>
};

// Usage in App.jsx
<ProtectedRoute>
  <Dashboard />    {/* This is the 'children' prop */}
</ProtectedRoute>
```

---

## SECTION 5: State — `useState` Hook

**State** = Data that can change over time. When state changes, React re-renders the component.

```jsx
import { useState } from 'react';

const Login = () => {
  // Declaring state:
  const [email, setEmail] = useState('');     // Initial value: ''
  const [password, setPassword] = useState('');
  //     ↑           ↑
  //   value      setter function

  // Updating state:
  const handleChange = (e) => {
    setEmail(e.target.value);  // Use the setter, not direct assignment!
  };

  return (
    <input 
      value={email}           // Controlled input — value tied to state
      onChange={handleChange}  // Update state when user types
    />
  );
};
```

### Why Not Modify State Directly?

```javascript
// ❌ WRONG — React won't re-render
email = 'new@email.com';

// ✅ CORRECT — React detects change and re-renders
setEmail('new@email.com');
```

### Complex State (Objects and Arrays)

```jsx
// Object state
const [editUser, setEditUser] = useState({ name: '', email: '', id: null });

// Updating an object — spread the old state, change one field
setEditUser({ ...editUser, name: e.target.value });

// Array state
const [bookings, setBookings] = useState([]);
setBookings(bookingsData.data);  // Replace entire array
```

---

## SECTION 6: Side Effects — `useEffect` Hook

**`useEffect`** runs code **after** the component renders. Used for:
- Fetching data from APIs
- Setting up event listeners
- Updating the document title

### Basic Syntax

```jsx
useEffect(() => {
  // Code to run
}, [dependencies]);
//  ↑
// When to run:
// []        → Only on first render (like componentDidMount)
// [id]      → When 'id' changes
// no array  → Every render (usually wrong!)
```

### From Your Dashboard.jsx — Fetching Data

```jsx
useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const response = await fetch('http://localhost:3001/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.success) {
      setProfiles([{ id: data.data._id, name: data.data.name, email: data.data.email }]);
    }
  };
  
  fetchProfile();
}, []);   // [] = run once when component mounts
```

**Why define `fetchProfile` inside `useEffect`?** Because `useEffect` callback cannot be `async` directly. So we define an async function inside and call it.

---

## SECTION 7: React Router

React Router enables **client-side routing** — navigating between pages without full page reload.

### Key Components

```jsx
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
```

| Component | Purpose |
|-----------|---------|
| `<Router>` | Wraps the entire app, enables routing |
| `<Routes>` | Container for all routes |
| `<Route path="/login" element={<Login />}>` | Maps URL to component |
| `<Link to="/login">` | Like `<a>` tag, but no page reload |
| `<Navigate to="/login" replace>` | Programmatic redirect |
| `useNavigate()` | Hook for programmatic navigation |

### From Your App.jsx

```jsx
<Router>
  <Routes>
    {/* Public — anyone can access */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />

    {/* Protected — only logged-in users */}
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
  </Routes>
</Router>
```

### Protected Routes

```jsx
// ProtectedRoute.jsx — Guards private pages
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;  // Redirect to login
  }
  
  return children;  // Show the protected page
};
```

**`replace`** means the `/login` page replaces the current entry in history — so clicking Back doesn't go to the protected page.

### Programmatic Navigation

```jsx
// In Login.jsx
const navigate = useNavigate();

// After successful login:
navigate('/');  // Go to home page
```

---

## SECTION 8: Context API — Global State

**Problem:** Passing data through many components (prop drilling):
```
App → Navbar → UserMenu → UserAvatar  (passing user down 4 levels = messy)
```

**Solution:** Context API — share data globally without passing props manually.

### From Your SnackbarContext.jsx

```jsx
// 1. Create Context
const SnackbarContext = createContext();

// 2. Create Provider (wraps the app, provides the value)
export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' });
  
  const showSnackbar = useCallback((message, type = 'success') => {
    setSnackbar({ isOpen: true, message, type });
    setTimeout(() => setSnackbar(prev => ({ ...prev, isOpen: false })), 3000);
  }, []);
  
  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      {snackbar.isOpen && <div>...</div>}  {/* The actual snackbar UI */}
    </SnackbarContext.Provider>
  );
};

// 3. Custom hook to use context (clean interface)
export const useSnackbar = () => {
  return useContext(SnackbarContext);
};
```

```jsx
// 4. In any component, use it directly without props:
const Login = () => {
  const showSnackbar = useSnackbar();  // No prop drilling!
  
  showSnackbar('Login successful!', 'success');
};
```

### `useCallback` Hook

`useCallback` **memoizes** (remembers) a function so it doesn't get recreated on every render. Used for performance when passing functions to child components.

---

## SECTION 9: Making API Calls

### Axios vs Fetch

Both make HTTP requests. Your project uses both:

```jsx
// Axios (in Login.jsx) — simpler, auto-parses JSON
const { data } = await axios.post('http://localhost:3001/api/auth/login', {
  email,
  password,
});

// Fetch (in Dashboard.jsx) — built-in, more verbose
const response = await fetch('http://localhost:3001/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();  // Manual JSON parsing
```

**Axios advantages:**
- Auto-parses JSON response
- Shorter error messages
- Interceptors (middleware for requests/responses)
- Better browser support

### Sending Authorization Header

```jsx
headers: {
  'Authorization': `Bearer ${token}`
}
```

This sends the JWT token to the backend. The `protect` middleware reads this and verifies it.

---

## SECTION 10: Controlled vs Uncontrolled Components

### Controlled Components (What React recommends)

React controls the form input value through state:

```jsx
// Controlled — React is the single source of truth
const [email, setEmail] = useState('');

<input 
  value={email}                           // Controlled by state
  onChange={(e) => setEmail(e.target.value)}  // Updates state
/>
```

**Benefit:** The input value is always in sync with your state — you can validate, format, or conditionally allow input.

---

*Next → Read `04-CODE-EXPLAINED.md` to understand every file in your project!*
