import { createFileRoute } from '@tanstack/react-router';
import type { GeoInfo, HistoryItem } from '../../types/common';
import { useState, useEffect } from 'react';
import { API_URL } from '../../url/api';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';


export const Route = createFileRoute('/_layout/home')({
  component: RouteComponent,
});

function RouteComponent() {
  const [geoInfo, setGeoInfo] = useState<GeoInfo | null>(null);
  const [inputIp, setInputIp] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  

  const { user } = useAuth()
  // const user = JSON.parse(localStorage.getItem('user') || "{}")
  const userId = user?.id;
  
  
  useEffect(() => {
    fetchMyIp()
    fetchHistory()
  }, [])

  
  const fetchMyIp = async () => {
    const { data } = await axios.get('https://ipinfo.io/json');
    const result = await axios.get(`${API_URL}/api/lookup/${data.ip}?userId=${userId}`)
    setGeoInfo(result.data);
  }
  
  const fetchHistory = async () => {
    const { data } = await axios.get(`${API_URL}/api/history?userId=${userId}`);
    setHistory(data)
  }

  const handleSearch = async () => {
    setError('')
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    if(!ipv4Regex.test(inputIp)) {
      setError('Invalid IP address format');
      return
    }
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/lookup/${inputIp}?userId=${userId}`);
      setGeoInfo(data);
      fetchHistory();
    }catch {
      setError("Failed to fetch IP info");
    }finally {
      setIsLoading(false);
    }
  }

  const handleClearHistory = async () => {
    try {
      await axios.delete(`${API_URL}/api/history/all?userId=${userId}`)
      setHistory([])
    }catch(error) {
      console.log(error)
    }
  }

  
const toggleSelect = (id: number) => {
  setSelectedIds((prev)=> 
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  )
}
  
  const handleSelectedHistory = async () => {
    if(selectedIds.length === 0) return;
    try {
      await axios.delete(`${API_URL}/api/history?userId=${userId}`, { data: {ids : selectedIds}})
      setHistory((prev) => prev.filter((item ) => !selectedIds.includes(item.id)))
      setSelectedIds([])
    }catch(error) {
      console.error(error);
    }
  }

  const handleClear = () => {
    setInputIp("")
    setError("")
    fetchMyIp();
  }



  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">IP Geolocation</h1>

      {/* Search */}
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputIp}
          onChange={(e) => setInputIp(e.target.value)}
          placeholder="Enter IP address"
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          type='submit'
          disabled={isLoading}
          className="bg-amber-950 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Search
        </button>
        <button
          type='button'
          onClick={handleClear}
          className="border px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>
      </form>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Geo Info Card */}
      {geoInfo && (
        <div className="border rounded p-4 mb-6 bg-gray-50">
          <h2 className="font-semibold mb-2">Geolocation Info</h2>
          <p><span className="font-medium">IP:</span> {geoInfo.ip}</p>
          <p><span className="font-medium">City:</span> {geoInfo.city}</p>
          <p><span className="font-medium">Region:</span> {geoInfo.region}</p>
          <p><span className="font-medium">Country:</span> {geoInfo.country}</p>
          <p><span className="font-medium">Org:</span> {geoInfo.org}</p>
          <p><span className="font-medium">Timezone:</span> {geoInfo.timezone}</p>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
        <div className='flex justify-between'>
          <h2 className="font-semibold mb-2">Search History</h2>
          <button className='pb-1 font-semibold hover:text-red-400' onClick={handleClearHistory}>Delete All</button>
        </div>
          <ul className="border rounded divide-y">
            {history.map((item) => (
              <li
                key={item.id}
                className="px-4 py-2 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                onClick={() => setGeoInfo(item.result)}
              >
                <span>{item.ip}</span>
                <span className="text-sm text-gray-400">
                  {item.result.city}, {item.result.country}
                </span>
                
                <input type="checkbox" checked={selectedIds.includes(item.id)}
                onChange={() => toggleSelect(item.id)} name="" id="" />
              </li>
            ))}
          </ul>
      <div>
          <button onClick={handleSelectedHistory}
          className="text-lg py-2 mt-1 border rounded w-full text-red-600 hover:underline"
          >
          {selectedIds.length > 0 ? `Delete selected (${selectedIds.length}) ` :  "Delete selected"}
        </button>
        </div>
      </div>
      )}
    </div>
  )
}

 