import React from 'react';
import { createRoot } from 'react-dom/client'; // ✅ NEW API
import Home from "./Home";

function Example() {
    return <Home />;
}

export default Example;

const el = document.getElementById('example');
if (el) {
    const root = createRoot(el); // ✅ NEW
    root.render(<Example />);
}
