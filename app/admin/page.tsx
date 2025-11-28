"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, FileText, Check, X, AlertCircle, RefreshCw } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  plan_type: string | null;
  subscription_status: string | null;
  created_at: string;
}

interface LogData {
  id: string;
  user_id: string;
  prompt: string;
  model: string;
  type: 'image' | 'video';
  created_at: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  
  // Edit Subscription State
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const usersRes = await fetch('/api/admin/users');
      if (usersRes.status === 401) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);

      const logsRes = await fetch('/api/admin/logs');
      const logsData = await logsRes.json();
      setLogs(logsData.logs || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSubscription = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          planType: selectedPlan,
          status: selectedStatus
        })
      });
      
      if (res.ok) {
        setEditingUser(null);
        fetchData(); // Refresh data
      } else {
        alert("Failed to update subscription");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating subscription");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (error === "Unauthorized") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-bold">Unauthorized Access</h1>
        <p className="text-gray-400">You do not have permission to view this page.</p>
        <Button onClick={() => router.push('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <Button onClick={fetchData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        <div className="flex gap-4 mb-6 border-b border-neutral-800 pb-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'users' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            Users & Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'logs' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            Activity Logs
          </button>
        </div>

        {activeTab === 'users' ? (
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-950 text-gray-400 uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{user.name || 'No Name'}</td>
                      <td className="px-6 py-4 text-gray-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.plan_type === 'ultra' ? 'bg-purple-500/20 text-purple-400' :
                          user.plan_type === 'premium' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.plan_type || 'Free'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.subscription_status === 'active' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {user.subscription_status || 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => {
                            setEditingUser(user);
                            setSelectedPlan(user.plan_type || 'free');
                            setSelectedStatus(user.subscription_status || 'active');
                          }}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-950 text-gray-400 uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Model</th>
                    <th className="px-6 py-4">Prompt</th>
                    <th className="px-6 py-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.type === 'video' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{log.model}</td>
                      <td className="px-6 py-4 text-gray-400 max-w-md truncate" title={log.prompt}>
                        {log.prompt}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
          <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
            <DialogHeader>
              <DialogTitle>Edit Subscription</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Plan Type</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="ultra">Ultra</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
              <Button onClick={handleSaveSubscription} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
