'use client';

import { useState } from 'react';

export default function AdminSync() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSync = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sync-github', {
        method: 'POST',
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Sync failed', details: error });
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/sync-github');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Status check failed', details: error });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">GitHub Sync Admin</h1>
      
      <div className="flex gap-4 mb-8">
        <button
          onClick={handleSync}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Syncing...' : 'Sync GitHub Repos'}
        </button>
        
        <button
          onClick={checkStatus}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Check Status
        </button>
      </div>

      {result && (
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Result:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
