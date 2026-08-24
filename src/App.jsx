import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Anomalies from './pages/Anomalies';
import ImportLogs from './pages/ImportLogs';

export default function App() {
  return (
    <div className="min-h-screen bg-[#09090b] flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[260px] h-screen">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1440px] mx-auto space-y-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/anomalies" element={<Anomalies />} />
              <Route path="/import" element={<ImportLogs />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
