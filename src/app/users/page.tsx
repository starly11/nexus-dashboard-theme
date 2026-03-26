"use client";

import React, {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  initialUsers,
  userGrowthBars,
  userRoleAccents,
  userRoleFilterOptions,
  userRoleOptions,
  userSkeletonRows,
  userStatusFilterOptions,
} from "@/data/users";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, TableColumn } from "@/components/ui/Table";
import type { InviteFormState, UserRecord, UserRole, UserRoleFilter, UserStatusFilter } from "@/types/users";

function isUserRole(value: string): value is UserRole {
  return userRoleOptions.some((role) => role === value);
}

function isUserRoleFilter(value: string): value is UserRoleFilter {
  return userRoleFilterOptions.some((role) => role === value);
}

function isUserStatusFilter(value: string): value is UserStatusFilter {
  return userStatusFilterOptions.some((status) => status === value);
}

export default function UsersPage(): React.JSX.Element {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>("All");
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuUserId, setMobileMenuUserId] = useState<string | null>(null);
  const [userActivityMessage, setUserActivityMessage] = useState("Select a user to inspect row actions, role state, and recent activity.");
  const [inviteForm, setInviteForm] = useState<InviteFormState>({
    name: "",
    email: "",
    role: "Viewer",
  });

  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [user.name, user.email, user.id].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [deferredSearchQuery, roleFilter, statusFilter, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / 10));
  const pageStart = (currentPage - 1) * 10;
  const paginatedUsers = filteredUsers.slice(pageStart, pageStart + 10);
  const allVisibleSelected = paginatedUsers.length > 0 && paginatedUsers.every((user) => selectedIds.includes(user.id));
  const totalActiveUsers = users.filter((user) => user.status === "active").length;
  const pendingInvites = users.filter((user) => user.status === "pending" || user.status === "invited").length;

  const toggleUserSelection = useCallback((id: string): void => {
    setSelectedIds((currentSelection) =>
      currentSelection.includes(id)
        ? currentSelection.filter((selection) => selection !== id)
        : [...currentSelection, id]
    );
  }, []);

  const toggleVisibleSelection = (): void => {
    setSelectedIds((currentSelection) => {
      if (allVisibleSelected) {
        return currentSelection.filter((selection) => !paginatedUsers.some((user) => user.id === selection));
      }

      const nextSelection = new Set(currentSelection);
      paginatedUsers.forEach((user) => nextSelection.add(user.id));

      return Array.from(nextSelection);
    });
  };

  const clearFilters = (): void => {
    setSearchQuery("");
    setRoleFilter("All");
    setStatusFilter("All");
  };

  const submitInvite = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const newUser: UserRecord = {
      id: `NX-${Math.floor(1000 + Math.random() * 8999)}`,
      name: inviteForm.name.trim(),
      email: inviteForm.email.trim().toLowerCase(),
      role: inviteForm.role,
      status: "invited",
      lastSeen: "Invite pending",
      joinedDate: "Today",
    };

    startTransition(() => {
      setUsers((currentUsers) => [newUser, ...currentUsers]);
      setIsInviteOpen(false);
      setInviteForm({ name: "", email: "", role: "Viewer" });
      setCurrentPage(1);
    });
    setUserActivityMessage(`Invite created for ${newUser.name} with ${newUser.role} access.`);
  };

  const columns = useMemo<TableColumn<UserRecord>[]>(
    () => [
    {
      key: "select",
      header: "",
      className: "w-12",
      render: (_, user) => (
        <input
          checked={selectedIds.includes(user.id)}
          onChange={() => toggleUserSelection(user.id)}
          onClick={(event) => event.stopPropagation()}
          className="h-4 w-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary"
          aria-label={`Select ${user.name}`}
          type="checkbox"
        />
      ),
    },
    {
      key: "name",
      header: "User",
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-on-surface">{user.name}</p>
            <p className="font-mono-data text-tiny text-on-surface-variant/50">ID: {user.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (value) => (
        <span className="block max-w-60 truncate text-sm text-on-surface-variant/80" title={String(value ?? "")}>
          {String(value ?? "")}
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (_, user) => (
        <span
            className={`inline-flex items-center rounded-lg border px-2.5 py-1 font-mono-data text-2xs uppercase tracking-label-md ${userRoleAccents[user.role]}`}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (_, user) => <StatusBadge status={user.status} />,
    },
    {
      key: "lastSeen",
      header: "Last Seen",
      className: "text-right",
      render: (value) => <span className="font-mono-data text-xs text-on-surface-variant/70">{String(value ?? "")}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-center",
      render: (_, user) => (
        <div className="relative flex items-center justify-center">
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={(event) => {
                event.stopPropagation();
                setUserActivityMessage(`Editing flow prepared for ${user.name}.`);
                setIsInviteOpen(true);
                setInviteForm({
                  name: user.name,
                  email: user.email,
                  role: user.role,
                });
              }}
              className="rounded-lg p-2 text-secondary/55 transition-colors hover:text-secondary"
              aria-label={`Edit ${user.name}`}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setUsers((currentUsers) => currentUsers.filter((currentUser) => currentUser.id !== user.id));
                setSelectedIds((currentSelection) => currentSelection.filter((selection) => selection !== user.id));
                setUserActivityMessage(`${user.name} was removed from the workspace directory.`);
              }}
              className="rounded-lg p-2 text-error/60 transition-colors hover:text-error"
              aria-label={`Delete ${user.name}`}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
          <div className="sm:hidden">
            <button
              onClick={(event) => {
                event.stopPropagation();
                setMobileMenuUserId((currentId) => (currentId === user.id ? null : user.id));
              }}
              className="rounded-lg p-2 text-on-surface-variant/50 transition-colors hover:bg-surface-container-high hover:text-on-surface"
              aria-label={`Open actions for ${user.name}`}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">more_horiz</span>
            </button>
            {mobileMenuUserId === user.id ? (
              <div
                onClick={(event) => event.stopPropagation()}
                className="absolute right-0 top-full z-20 mt-1 w-36 rounded-2xl border border-outline-variant/12 bg-surface-container-high p-2 shadow-panel"
              >
                <button
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-on-surface transition-colors hover:bg-surface-container-highest"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base text-primary">edit</span>
                  Edit
                </button>
                <button
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-on-surface transition-colors hover:bg-surface-container-highest"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base text-error">delete</span>
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ),
    },
    ],
    [mobileMenuUserId, selectedIds, toggleUserSelection]
  );

  const tableFooter = (
    <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-mono-data text-xs text-on-surface-variant/50">
        {filteredUsers.length === 0
          ? "Showing 0 users"
          : `Showing ${pageStart + 1}-${Math.min(pageStart + paginatedUsers.length, filteredUsers.length)} of ${filteredUsers.length} users`}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
          type="button"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        <span className="rounded-lg bg-primary-container px-3 py-2 font-mono-data text-xs text-on-primary">
          {currentPage}
        </span>
        <button
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
          type="button"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );

  return (
    <AppLayout
      title="Users"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Users" },
      ]}
    >
      <div className="space-y-8 pb-8">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/14 bg-primary/10 px-3 py-2 text-primary">
              <span className="glow-dot-primary h-2 w-2 rounded-full bg-primary" />
              <span className="font-mono-data text-2xs uppercase tracking-label-2xl">Access Control Center</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
              Users <span className="text-secondary">Management</span>
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-on-surface-variant/70 lg:text-base">
              Manage organizational access, roles, invite state, and security visibility for your enterprise workspace.
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setIsInviteOpen(true)}>
            <span className="material-symbols-outlined text-lg">person_add</span>
            Invite User
          </Button>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <Card className="xl:col-span-8" padding="lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/45">User Growth</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <p className="font-mono-data text-5xl font-black tracking-tight-sm text-on-surface">{users.length}</p>
                  <span className="flex items-center font-mono-data text-sm text-success">
                    +12.4%
                    <span className="material-symbols-outlined text-xs">trending_up</span>
                  </span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-high/80 px-3 py-2">
                <span className="glow-dot-primary h-2 w-2 rounded-full bg-primary" />
                <span className="font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/60">Live Metrics</span>
              </div>
            </div>
            <div className="mt-8 flex h-24 items-end gap-2">
              {userGrowthBars.map((bar, index) => (
                <div
                  key={bar.id}
                  className={`flex-1 rounded-t-sm ${index === 3 ? "bg-primary shadow-glow" : "bg-primary/20"}`}
                  style={{ height: `${bar.height}%` }}
                />
              ))}
            </div>
            <p className="mt-5 text-sm text-on-surface-variant/70">{userActivityMessage}</p>
          </Card>

          <div className="flex flex-col gap-6 xl:col-span-4">
            <Card className="flex items-center justify-between" padding="lg">
              <div>
                <p className="font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/45">Active Sessions</p>
                <p className="mt-2 text-3xl font-bold text-on-surface">{totalActiveUsers}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <span className="material-symbols-outlined">devices</span>
              </div>
            </Card>
            <Card className="relative overflow-hidden bg-primary-container text-on-primary" padding="lg">
              <div className="relative z-10">
                <p className="font-mono-data text-2xs uppercase tracking-label-xl opacity-70">Pending Invites</p>
                <p className="mt-2 text-3xl font-black">{pendingInvites}</p>
                <button className="mt-5 text-tiny font-bold uppercase tracking-label-md underline decoration-2 underline-offset-4" type="button">
                  Resend all
                </button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl opacity-10">mail</span>
            </Card>
          </div>
        </section>

        <section className="stitch-panel rounded-panel p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">
                filter_list
              </span>
              <input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl bg-surface-container-lowest py-3 pl-12 pr-4 text-sm text-on-surface outline-none ring-1 ring-transparent transition-all placeholder:text-on-surface-variant/35 focus:ring-primary/35"
                placeholder="Filter by name, email, or ID..."
                aria-label="Filter users"
                type="text"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={roleFilter}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  if (!isUserRoleFilter(event.target.value)) {
                    return;
                  }

                  setRoleFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-xl bg-surface-container-lowest px-4 py-3 font-mono-data text-sm text-on-surface-variant outline-none ring-1 ring-transparent transition-all focus:ring-primary/35"
                aria-label="Filter by role"
              >
                <option value="All">Role: All</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <select
                value={statusFilter}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  if (!isUserStatusFilter(event.target.value)) {
                    return;
                  }

                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-xl bg-surface-container-lowest px-4 py-3 font-mono-data text-sm text-on-surface-variant outline-none ring-1 ring-transparent transition-all focus:ring-primary/35"
                aria-label="Filter by status"
              >
                <option value="All">Status: All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="invited">Invited</option>
                <option value="error">Error</option>
              </select>
              <Button variant="secondary" size="md" onClick={clearFilters}>
                <span className="material-symbols-outlined text-lg text-primary">restart_alt</span>
                Clear
              </Button>
            </div>
          </div>
        </section>

        {isLoading ? (
          <Card padding="none">
            <div className="border-b border-outline-variant/10 bg-surface-container-low/70 px-6 py-5">
              <div className="h-5 w-36 rounded-full bg-surface-container-high shimmer-surface animate-shimmer" />
            </div>
            <div className="divide-y divide-outline-variant/10">
              {userSkeletonRows.map((row) => (
                <div key={row} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-4 w-4 rounded bg-surface-container-high shimmer-surface animate-shimmer" />
                  <div className="h-10 w-10 rounded-xl bg-surface-container-high shimmer-surface animate-shimmer" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 rounded-full bg-surface-container-high shimmer-surface animate-shimmer" />
                    <div className="h-3 w-28 rounded-full bg-surface-container-high shimmer-surface animate-shimmer" />
                  </div>
                  <div className="hidden h-3 w-32 rounded-full bg-surface-container-high shimmer-surface animate-shimmer md:block" />
                  <div className="hidden h-8 w-20 rounded-lg bg-surface-container-high shimmer-surface animate-shimmer md:block" />
                </div>
              ))}
            </div>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">No Results</p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-on-surface">No users found</h3>
            <p className="mt-2 text-sm text-on-surface-variant/70">
              Try a different name, role, or status filter. You can also clear everything and start again.
            </p>
            <div className="mt-5">
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </Card>
        ) : (
          <Table
            title="Users Directory"
            description="Manage access permissions, recent activity, and invite state."
            columns={columns}
            data={paginatedUsers}
            onRowClick={(user) => setUserActivityMessage(`Focused ${user.name} (${user.role}) from the workspace directory.`)}
            footer={tableFooter}
            actions={
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 font-mono-data text-xs text-on-surface-variant/55">
                  <input
                    checked={allVisibleSelected}
                    onChange={toggleVisibleSelection}
                    className="h-4 w-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary"
                    aria-label="Select all visible users"
                    type="checkbox"
                  />
                  Select page
                </label>
                <Button variant="secondary" size="sm">
                  <span className="material-symbols-outlined text-lg">download</span>
                  Export
                </Button>
              </div>
            }
          />
        )}
      </div>

      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        label="Invite User"
        title="Send a new workspace invitation"
        className="max-w-xl"
        closeLabel="Close invite modal"
      >
        <form className="mt-6 space-y-4" onSubmit={submitInvite}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-on-surface">Full name</span>
                <input
                  required
                  value={inviteForm.name}
                  onChange={(event) => setInviteForm((currentForm) => ({ ...currentForm, name: event.target.value }))}
                  className="w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-transparent transition-all focus:ring-primary/35"
                  placeholder="Alex Rivera"
                  aria-label="Invitee name"
                  type="text"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-on-surface">Email address</span>
                <input
                  required
                  value={inviteForm.email}
                  onChange={(event) => setInviteForm((currentForm) => ({ ...currentForm, email: event.target.value }))}
                  className="w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-transparent transition-all focus:ring-primary/35"
                  placeholder="alex@nexushq.io"
                  aria-label="Invitee email"
                  type="email"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-on-surface">Role</span>
                <select
                  value={inviteForm.role}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    if (!isUserRole(event.target.value)) {
                      return;
                    }

                    setInviteForm((currentForm) => ({ ...currentForm, role: event.target.value }));
                  }}
                  className="w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-transparent transition-all focus:ring-primary/35"
                  aria-label="Invitee role"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </label>
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" type="button" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  <span className="material-symbols-outlined text-lg">send</span>
                  Send Invite
                </Button>
              </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
