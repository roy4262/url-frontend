import React, { useEffect, useState } from "react";
import axios from "axios";

// Vite exposes env vars on import.meta.env with a VITE_ prefix
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
// Optional override for the public short URL base the frontend should copy/open.
const FRONTEND_SHORT_BASE = import.meta.env.VITE_SHORT_URL_BASE || null;

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/api/links`);
      setLinks(r.data);
    } catch (err) {
      setError("Failed to load links");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = { url: url.trim() };
      if (code.trim()) payload.code = code.trim();
      const r = await axios.post(`${API}/api/links`, payload);
      // success: prepend
      setLinks((prev) => [
        { code: r.data.code, url: r.data.url, clicks: 0, lastClicked: null },
        ...prev,
      ]);
      setUrl("");
      setCode("");
    } catch (err) {
      if (err.response && err.response.status === 409)
        setError("Code already exists");
      else setError("Create failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(c) {
    if (!confirm("Delete this link?")) return;
    try {
      await axios.delete(`${API}/api/links/${c}`);
      setLinks((prev) => prev.filter((l) => l.code !== c));
    } catch (err) {
      alert("Delete failed");
    }
  }

  async function handleCopy(text, code) {
    await navigator.clipboard?.writeText(text);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  const getShortUrl = (l) =>
    l.shortUrl || `${FRONTEND_SHORT_BASE || window.location.origin}/${l.code}`;

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Short Link</h2>
          <p className="text-sm text-gray-500 mt-1">Transform your long URLs into concise, shareable links</p>
        </div>
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Long URL
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
              placeholder="https://example.com/very/long/url"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom code <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
              placeholder="my-awesome-link"
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          <button
            disabled={submitting || !url.trim()}
            className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            ) : (
              "Create Link"
            )}
          </button>
        </form>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Links</h2>
          <p className="text-sm text-gray-500 mt-1">{links.length} total links</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-500 text-sm">Loading your links...</p>
            </div>
          </div>
        ) : links.length === 0 ? (
          <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No links yet. Create one to get started!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((l) => (
              <div key={l.code} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-mono">{l.code}</code>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{l.clicks} clicks</span>
                  </div>
                  <a
                    href={getShortUrl(l)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium break-all text-sm mb-1 block"
                    title={getShortUrl(l)}
                  >
                    {getShortUrl(l)}
                  </a>
                  <p className="text-gray-600 text-sm break-all" title={l.url}>
                    {l.url}
                  </p>
                  {l.lastClicked && (
                    <p className="text-gray-400 text-xs mt-2">
                      Last clicked: {new Date(l.lastClicked).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(getShortUrl(l), l.code)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      copied === l.code
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {copied === l.code ? "✓ Copied" : "Copy"}
                  </button>
                  <button
                    onClick={() => handleDelete(l.code)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
