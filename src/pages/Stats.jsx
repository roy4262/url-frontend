import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Use Vite env var (VITE_API_URL). Falls back to localhost:4000 when not provided.
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Stats() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const r = await axios.get(`${API}/api/links/${code}`);
        setData(r.data);
      } catch (err) {
        setError("Not found");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [code]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold">Stats for {data.code}</h2>
      <div className="mt-4 space-y-2">
        <div>
          <strong>URL:</strong>{" "}
          <a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600"
          >
            {data.url}
          </a>
        </div>
        <div>
          <strong>Clicks:</strong> {data.clicks}
        </div>
        <div>
          <strong>Last Clicked:</strong> {data.lastClicked || "-"}
        </div>
      </div>
    </div>
  );
}
