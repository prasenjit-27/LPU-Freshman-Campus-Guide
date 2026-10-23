"use client";
import { useState, useEffect, useCallback } from "react";
import { 
  Users, 
  Search, 
  ShieldCheck, 
  UserX, 
  UserCheck, 
  KeyRound, 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  Clock, 
  Eye
} from "lucide-react";

export default function AdminUserManager({ currentAdminId }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  // Modal / Detailed view states
  const [inspectUser, setInspectUser] = useState(null);
  const [passwordModal, setPasswordModal] = useState({ open: false, user: null, password: "" });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, user: null });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        q,
        role: roleFilter,
        status: statusFilter,
      });
      const r = await fetch(`/api/admin/users?${params.toString()}`);
      if (!r.ok) {
        setMsg({ text: "Failed to load user directory.", type: "error" });
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
  }, [page, q, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleStatusToggle(u) {
    const nextStatus = u.status === "deactivated" ? "active" : "deactivated";
    if (u._id === currentAdminId) {
      alert("You cannot deactivate your own administrative account.");
      return;
    }
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
        setMsg({ text: `Account status updated to ${nextStatus}.`, type: "success" });
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

  async function handleRoleToggle(u) {
    const nextRole = u.role === "admin" ? "student" : "admin";
    if (u._id === currentAdminId) {
      alert("Self-demotion is restricted to avoid lockout.");
      return;
    }
    if (!confirm(`Are you sure you want to change ${u.name}'s role to ${nextRole.toUpperCase()}?`)) return;

    setActionLoading(true);
    setMsg({ text: "", type: "" });
    try {
      const r = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: u._id, role: nextRole }),
      });
      const data = await r.json();
      if (r.ok) {
        setMsg({ text: `Role updated to ${nextRole}.`, type: "success" });
        fetchUsers();
      } else {
        setMsg({ text: data.error || "Action failed.", type: "error" });
      }
    } catch {
      setMsg({ text: "Network error changing role.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePasswordReset(e) {
    e.preventDefault();
    if (!passwordModal.password || passwordModal.password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    setActionLoading(true);
    try {
      const r = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: passwordModal.user._id, newPassword: passwordModal.password }),
      });
      const data = await r.json();
      if (r.ok) {
        setMsg({ text: `Password successfully updated for ${passwordModal.user.email}.`, type: "success" });
        setPasswordModal({ open: false, user: null, password: "" });
      } else {
        setMsg({ text: data.error || "Failed to update password.", type: "error" });
      }
    } catch {
      setMsg({ text: "Network error during password reset.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteUser() {
    if (!deleteConfirm.user) return;
    setActionLoading(true);
    try {
      const r = await fetch(`/api/admin/users?id=${deleteConfirm.user._id}`, { method: "DELETE" });
      const data = await r.json();
      if (r.ok) {
        setMsg({ text: `Account for ${deleteConfirm.user.email} and all personal data deleted.`, type: "success" });
        setDeleteConfirm({ open: false, user: null });
        if (inspectUser?._id === deleteConfirm.user._id) setInspectUser(null);
        fetchUsers();
      } else {
        setMsg({ text: data.error || "Failed to delete user.", type: "error" });
      }
    } catch {
      setMsg({ text: "Network error during user deletion.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {msg.text && (
        <div className={`flex items-center justify-between rounded-xl p-4 text-sm font-medium ${
          msg.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          <div className="flex items-center gap-2">
            {msg.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className="h-5 w-5 text-red-600" />}
            <span>{msg.text}</span>
          </div>
          <button onClick={() => setMsg({ text: "", type: "" })} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {/* Control Bar: Search & Filters */}
      <div className="card border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              className="input pl-10 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="input text-xs w-auto py-2"
              aria-label="Filter by role"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="admin">Administrators</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="input text-xs w-auto py-2"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="deactivated">Deactivated</option>
            </select>

            <button
              onClick={fetchUsers}
              disabled={loading}
              className="btn bg-slate-100 text-slate-700 hover:bg-slate-200 py-2 px-3 text-xs flex items-center gap-1.5"
              title="Refresh Directory"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
          <span>Showing {users.length} of {total} registered users</span>
          <span>Role updates & deactivations enforce immediate session control</span>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="card border border-slate-200 shadow-sm p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-3">Role</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Onboarding</th>
                <th className="py-3.5 px-3">Registered</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
                      <p className="text-xs">Loading directory...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                    No users matching the current search criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isCurrent = u._id === currentAdminId;
                  const isDeactivated = u.status === "deactivated";
                  return (
                    <tr key={u._id} className={`hover:bg-slate-50/60 transition-colors ${isDeactivated ? "bg-slate-50/40 opacity-75" : ""}`}>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                            u.role === "admin" ? "bg-indigo-600" : "bg-slate-500"
                          }`}>
                            {u.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 truncate flex items-center gap-1.5">
                              {u.name}
                              {isCurrent && (
                                <span className="rounded bg-indigo-100 text-indigo-700 text-[10px] font-semibold px-1.5 py-0.2">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          u.role === "admin" 
                            ? "bg-purple-50 text-purple-700 border border-purple-200" 
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {u.role === "admin" && <ShieldCheck className="h-3 w-3" />}
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          u.status === "deactivated" 
                            ? "bg-rose-50 text-rose-700 border border-rose-200" 
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${u.status === "deactivated" ? "bg-rose-500" : "bg-emerald-500"}`} />
                          {u.status || "active"}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">{u.completedTasks || 0}</span> / 15 tasks
                      </td>

                      <td className="py-3.5 px-3 text-xs text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectUser(u)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Inspect details & profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setPasswordModal({ open: true, user: u, password: "" })}
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Reset password"
                          >
                            <KeyRound className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleStatusToggle(u)}
                            disabled={isCurrent || actionLoading}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isDeactivated 
                                ? "text-emerald-600 hover:bg-emerald-50" 
                                : "text-amber-600 hover:bg-amber-50"
                            } disabled:opacity-40`}
                            title={isDeactivated ? "Activate Account" : "Deactivate Account"}
                          >
                            {isDeactivated ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                          </button>

                          <button
                            onClick={() => handleRoleToggle(u)}
                            disabled={isCurrent || actionLoading}
                            className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-40"
                            title={u.role === "admin" ? "Demote to Student" : "Promote to Admin"}
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirm({ open: true, user: u })}
                            disabled={isCurrent || actionLoading}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-1.5 px-2.5 text-xs disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-1.5 px-2.5 text-xs disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inspect User Modal */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="card max-w-lg w-full bg-white shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{inspectUser.name}</h3>
                <p className="text-xs text-slate-500">{inspectUser.email}</p>
              </div>
              <button onClick={() => setInspectUser(null)} className="text-slate-400 hover:text-slate-600 text-sm font-semibold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-slate-50 p-2.5">
                <span className="text-slate-400 block mb-0.5">Role</span>
                <span className="font-semibold text-slate-800 capitalize">{inspectUser.role}</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-2.5">
                <span className="text-slate-400 block mb-0.5">Account Status</span>
                <span className="font-semibold text-slate-800 capitalize">{inspectUser.status}</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-2.5">
                <span className="text-slate-400 block mb-0.5">Joined Date</span>
                <span className="font-semibold text-slate-800">
                  {inspectUser.createdAt ? new Date(inspectUser.createdAt).toLocaleString("en-IN") : "—"}
                </span>
              </div>
              <div className="rounded-lg bg-slate-50 p-2.5">
                <span className="text-slate-400 block mb-0.5">Last Login</span>
                <span className="font-semibold text-slate-800">
                  {inspectUser.lastLoginAt ? new Date(inspectUser.lastLoginAt).toLocaleString("en-IN") : "Never logged in"}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-100 p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <GraduationCap className="h-4 w-4 text-indigo-600" />
                <span>Student Academic Profile</span>
              </div>
              {inspectUser.profile ? (
                <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                  <div>School: <strong className="text-slate-800">{inspectUser.profile.school || "Not filled"}</strong></div>
                  <div>Programme: <strong className="text-slate-800">{inspectUser.profile.programme || "Not filled"}</strong></div>
                  <div>Year: <strong className="text-slate-800">{inspectUser.profile.year || "Not filled"}</strong></div>
                  <div>Stay: <strong className="text-slate-800">{inspectUser.profile.accommodation || "Not filled"}</strong></div>
                </div>
              ) : (
                <p className="text-slate-500">No profile configuration saved yet.</p>
              )}
            </div>

            <div className="rounded-lg border border-slate-100 p-3.5 space-y-1 text-xs">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Clock className="h-4 w-4 text-amber-600" />
                <span>Onboarding Checklist Progress</span>
              </div>
              <p className="text-slate-600">
                Completed <strong className="text-slate-900">{inspectUser.completedTasks || 0}</strong> of 15 suggested freshman guide tasks.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setInspectUser(null)} className="btn bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {passwordModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <form onSubmit={handlePasswordReset} className="card max-w-md w-full bg-white shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Admin Password Reset</h3>
                <p className="text-xs text-slate-500">For user: {passwordModal.user?.email}</p>
              </div>
              <button type="button" onClick={() => setPasswordModal({ open: false, user: null, password: "" })} className="text-slate-400 hover:text-slate-600 text-sm font-semibold">✕</button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">New Temporary Password</label>
              <input
                type="text"
                required
                minLength={8}
                value={passwordModal.password}
                onChange={(e) => setPasswordModal({ ...passwordModal, password: e.target.value })}
                placeholder="Enter at least 8 characters"
                className="input text-sm"
              />
              <p className="text-[11px] text-slate-500">Passwords are salted and securely hashed using bcrypt. The hash is never logged or exposed.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPasswordModal({ open: false, user: null, password: "" })}
                className="btn bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs"
              >
                Cancel
              </button>
              <button type="submit" disabled={actionLoading} className="btn text-xs">
                {actionLoading ? "Updating..." : "Save New Password"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Explicit Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="card max-w-md w-full bg-white shadow-xl border border-red-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirm Account Deletion</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-900">{deleteConfirm.user?.name}</strong> ({deleteConfirm.user?.email})? All student task progress, saved locations, and profile settings will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setDeleteConfirm({ open: false, user: null })}
                className="btn bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="btn bg-red-600 hover:bg-red-700 text-xs"
              >
                {actionLoading ? "Deleting..." : "Permanently Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
