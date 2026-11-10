"use client";
import { useState, useEffect, useCallback } from "react";
import { 
  Users, 
  UserX, 
  UserCheck, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert
} from "lucide-react";

export default function AdminUserManager() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });
      const r = await fetch(`/api/admin/users?${params.toString()}`);
      if (!r.ok) {
        setMsg({ text: "Failed to load user list.", type: "error" });
        setLoading(false);
        return;
      }
      const data = await r.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setMsg({ text: "Network error loading users.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleToggleBlock(u) {
    const isCurrentlyBlocked = u.status === "deactivated";
    const nextStatus = isCurrentlyBlocked ? "active" : "deactivated";
    const actionLabel = isCurrentlyBlocked ? "unblock" : "block";

    if (!confirm(`Are you sure you want to ${actionLabel} ${u.name} (${u.email})?`)) return;

    setActionLoading(true);
    setMsg({ text: "", type: "" });
    try {
      const r = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: u._id, status: nextStatus }),
      });
      const data = await r.json();
      if (r.ok) {
        setMsg({ 
          text: `User ${u.name} is now ${nextStatus === "deactivated" ? "blocked" : "active"}.`, 
          type: "success" 
        });
        fetchUsers();
      } else {
        setMsg({ text: data.error || "Action failed.", type: "error" });
      }
    } catch {
      setMsg({ text: "Network error performing action.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Notifications */}
      {msg.text && (
        <div className={`flex items-center justify-between rounded-xl border-3 border-black p-4 text-xs font-black shadow-neo-sm ${
          msg.type === "success" 
            ? "bg-emerald-100 text-emerald-950" 
            : "bg-rose-100 text-rose-950"
        }`}>
          <div className="flex items-center gap-2">
            {msg.type === "success" ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : <AlertTriangle className="h-4 w-4 text-rose-700" />}
            <span>{msg.text}</span>
          </div>
          <button onClick={() => setMsg({ text: "", type: "" })} className="text-xs uppercase underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Top Simple Metric: Total Normal Users */}
      <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-neo flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-lpu-yellow shadow-neo-sm text-black">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-black/60 tracking-wider">Total Registered Students</span>
            <div className="text-3xl font-black text-black">
              {loading ? "..." : total} <span className="text-sm font-bold text-black/60">students</span>
            </div>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="btn btn-white text-xs px-3.5 py-2 font-black self-start sm:self-auto shadow-neo-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Clean User Management Table */}
      <div className="rounded-2xl border-4 border-black bg-white shadow-neo-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-lpu-yellow border-b-3 border-black font-black uppercase tracking-wider text-black">
                <th className="py-3.5 px-5">Student User</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Freshman Progress</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 font-bold">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-black/50">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-lpu-orange" />
                      <p className="text-xs font-black uppercase">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-black/60 font-bold">
                    No normal student users registered yet.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isBlocked = u.status === "deactivated";
                  const pct = Math.round(((u.completedTasks || 0) / 15) * 100);

                  return (
                    <tr 
                      key={u._id} 
                      className={`hover:bg-amber-50/50 transition-colors ${
                        isBlocked ? "bg-rose-50/70" : ""
                      }`}
                    >
                      {/* User Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-full border-2 border-black flex items-center justify-center text-xs font-black text-black shrink-0 shadow-neo-sm ${
                            isBlocked ? "bg-rose-200" : "bg-white"
                          }`}>
                            {u.name?.charAt(0).toUpperCase() || "S"}
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-black text-sm truncate flex items-center gap-1.5">
                              {u.name}
                            </div>
                            <div className="text-[11px] text-black/60 truncate font-semibold">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-rose-200 px-3 py-1 text-[11px] font-black uppercase text-rose-900 shadow-neo-sm">
                            <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                            <span>Blocked</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-emerald-100 px-3 py-1 text-[11px] font-black uppercase text-emerald-900 shadow-neo-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-600" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      {/* User Progress */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5 max-w-[200px]">
                          <div className="flex items-center justify-between text-[11px] font-black">
                            <span>{u.completedTasks || 0} / 15 Tasks</span>
                            <span className="text-lpu-darkOrange">{pct}%</span>
                          </div>
                          <div className="h-2.5 w-full rounded-full border-2 border-black bg-slate-100 overflow-hidden">
                            <div 
                              className="h-full bg-lpu-yellow transition-all" 
                              style={{ width: `${Math.min(100, pct)}%` }} 
                            />
                          </div>
                        </div>
                      </td>

                      {/* Only Single Action: Block / Unblock User */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleToggleBlock(u)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black text-xs font-black shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer disabled:opacity-50 ${
                            isBlocked
                              ? "bg-emerald-300 hover:bg-emerald-400 text-black"
                              : "bg-rose-500 hover:bg-rose-600 text-white"
                          }`}
                        >
                          {isBlocked ? (
                            <>
                              <UserCheck className="h-3.5 w-3.5" />
                              <span>Unblock User</span>
                            </>
                          ) : (
                            <>
                              <UserX className="h-3.5 w-3.5" />
                              <span>Block User</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Simple Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t-3 border-black px-5 py-3 bg-[#FFFDF9]">
            <span className="text-xs font-bold text-black/70">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn-white text-xs py-1 px-2.5 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn btn-white text-xs py-1 px-2.5 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
