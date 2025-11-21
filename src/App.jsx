import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-xl font-semibold">TinyLink</h1>
          <nav>
            <Link to="/" className="text-sm text-blue-600">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
