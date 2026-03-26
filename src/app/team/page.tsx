"use client";

import React, { startTransition, useDeferredValue, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  initialPendingInvites,
  initialTeamMembers,
  permissionMatrix,
  presenceDotClasses,
  teamRoleBadgeClasses,
  teamRoleFilterOptions,
  teamRoleOptions,
} from "@/data/team";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { InviteState, TeamMember, TeamRole, TeamRoleFilter } from "@/types/team";

function isTeamRole(value: string): value is TeamRole {
  return teamRoleOptions.some((role) => role === value);
}

function isTeamRoleFilter(value: string): value is TeamRoleFilter {
  return teamRoleFilterOptions.some((role) => role === value);
}

export default function TeamPage(): React.JSX.Element {
  const [teamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [pendingInvites, setPendingInvites] = useState<string[]>(initialPendingInvites);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<TeamRoleFilter>("All");
  const [selectedMemberId, setSelectedMemberId] = useState<string>(initialTeamMembers[0].id);
  const [inviteState, setInviteState] = useState<InviteState>({ email: "", role: "Editor" });
  const [teamActivityMessage, setTeamActivityMessage] = useState("Select a member to inspect role access and recent workspace presence.");

  const deferredSearchQuery = useDeferredValue(searchQuery);
  const filteredMembers = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

    return teamMembers.filter((member) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [member.name, member.email, member.statusLabel].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesRole = roleFilter === "All" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [deferredSearchQuery, roleFilter, teamMembers]);

  const selectedMember =
    filteredMembers.find((member) => member.id === selectedMemberId) ??
    teamMembers.find((member) => member.id === selectedMemberId) ??
    teamMembers[0];

  const activeSeats = teamMembers.length + pendingInvites.length;
  const seatLimit = 20;
  const adminCount = teamMembers.filter((member) => member.role === "Admin").length;
  const onlineCount = teamMembers.filter((member) => member.presence === "active").length;

  const sendInvite = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const normalizedEmail = inviteState.email.trim().toLowerCase();
    if (!normalizedEmail) {
      return;
    }

    startTransition(() => {
      setPendingInvites((currentInvites) => [normalizedEmail, ...currentInvites]);
      setInviteState({ email: "", role: "Editor" });
    });
    setTeamActivityMessage(`Invite queued for ${normalizedEmail} with ${inviteState.role} access.`);
  };

  const revokeInvite = (email: string): void => {
    setTeamActivityMessage(`Invite revoked for ${email}.`);
    setPendingInvites((currentInvites) => currentInvites.filter((invite) => invite !== email));
  };

  const renderPermissionState = (allowed: boolean, tone: "primary" | "secondary" | "tertiary"): React.JSX.Element => {
    const toneClass =
      tone === "primary" ? "text-primary" : tone === "secondary" ? "text-secondary" : "text-tertiary-fixed";

    return (
      <span className={`material-symbols-outlined ${allowed ? `${toneClass} material-symbols-filled` : "text-outline-variant"}`}>
        {allowed ? "check_circle" : "remove_circle"}
      </span>
    );
  };

  return (
    <AppLayout
      title="Team"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Team" },
      ]}
    >
      <div className="space-y-10 pb-8">
        <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-black tracking-tight-sm text-primary">Team Management</h2>
            <div className="relative w-full max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-2xl bg-surface-container-lowest py-2.5 pl-10 pr-4 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all placeholder:text-outline-variant focus:ring-primary/35"
                placeholder="Search team members..."
                type="text"
                aria-label="Search team members"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-right">
              <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Admins</p>
              <p className="mt-2 font-mono-data text-2xl font-bold text-primary">{adminCount}</p>
            </div>
            <div className="hidden h-12 w-px bg-outline-variant/15 lg:block" />
            <div className="text-right">
              <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Active Now</p>
              <p className="mt-2 font-mono-data text-2xl font-bold text-success">{onlineCount}</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-12">
            <section>
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Active Members</h3>
                  <p className="mt-1 text-xs text-on-surface-variant">Manage your team&apos;s access levels and seat allocation.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-lg bg-primary-container/10 px-2 py-1 font-mono-data text-2xs uppercase tracking-label-md text-primary-container">
                    {activeSeats} / {seatLimit} seats used
                  </span>
                  <select
                    value={roleFilter}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      if (isTeamRoleFilter(event.target.value)) {
                        setRoleFilter(event.target.value);
                      }
                    }}
                    className="rounded-xl bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all focus:ring-primary/35"
                    aria-label="Filter members by role"
                  >
                    {teamRoleFilterOptions.map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {roleOption}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredMembers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedMemberId(member.id)}
                      className={`rounded-2xl bg-surface-container p-5 text-left transition-all duration-300 hover:bg-surface-container-high ${
                        selectedMemberId === member.id ? "ring-1 ring-primary/20 shadow-panel" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="relative">
                            <Avatar name={member.name} size="lg" />
                            <span className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-surface-container ${presenceDotClasses[member.presence]}`} />
                          </div>
                          <div>
                            <h4 className="font-bold text-on-surface">{member.name}</h4>
                            <p className="font-mono-data text-xs text-on-surface-variant">{member.email}</p>
                          </div>
                        </div>
                        <span className={`rounded-md border px-2 py-0.5 font-mono-data text-2xs uppercase tracking-label-sm ${teamRoleBadgeClasses[member.role]}`}>
                          {member.role}
                        </span>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-outline-variant/10 pt-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-data text-2xs uppercase tracking-label-md text-outline">Status</span>
                          <span className="text-xs text-on-surface">{member.statusLabel}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedMemberId(member.id);
                            setTeamActivityMessage(`Action menu prepared for ${member.name}.`);
                          }}
                          className="rounded-lg p-1 text-outline transition-colors hover:text-on-surface"
                          aria-label={`Open actions for ${member.name}`}
                        >
                          <span className="material-symbols-outlined text-lg">more_horiz</span>
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <Card className="bg-surface-container-low" padding="lg">
                  <p className="text-lg font-bold text-on-surface">No team members found.</p>
                  <p className="mt-2 text-sm text-on-surface-variant/72">Try another search term or role filter.</p>
                </Card>
              )}
            </section>

            <section className="overflow-hidden rounded-3xl border border-outline-variant/10 bg-surface-container-low">
              <div className="border-b border-outline-variant/10 bg-surface-container/50 p-6">
                <h3 className="text-lg font-bold text-on-surface">Role Permission Matrix</h3>
                <p className="mt-1 text-xs text-on-surface-variant">Granular control over team member capabilities across the platform.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-surface-container-lowest/50">
                      <th className="px-6 py-4 font-mono-data text-2xs uppercase tracking-label-lg text-outline">Permissions</th>
                      <th className="px-6 py-4 text-center font-mono-data text-2xs uppercase tracking-label-lg text-primary">Admin</th>
                      <th className="px-6 py-4 text-center font-mono-data text-2xs uppercase tracking-label-lg text-secondary">Editor</th>
                      <th className="px-6 py-4 text-center font-mono-data text-2xs uppercase tracking-label-lg text-tertiary">Viewer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {permissionMatrix.map((row) => (
                      <tr key={row.permission} className="transition-colors hover:bg-surface-container-high/30">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-on-surface">{row.permission}</div>
                          <div className="font-mono-data text-2xs text-on-surface-variant">{row.description}</div>
                        </td>
                        <td className="px-6 py-4 text-center">{renderPermissionState(row.admin, "primary")}</td>
                        <td className="px-6 py-4 text-center">{renderPermissionState(row.editor, "secondary")}</td>
                        <td className="px-6 py-4 text-center">{renderPermissionState(row.viewer, "tertiary")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24">
            <Card className="bg-surface-container" padding="lg">
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
                    <span className="material-symbols-outlined">person_add</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface">Invite Member</h3>
                  <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                    Add a new professional to your team workspace. They will receive an invitation email.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setInviteState({ email: "", role: "Editor" })}
                  className="rounded-lg p-1 text-outline transition-colors hover:text-on-surface"
                  aria-label="Clear invite form"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form className="space-y-5" onSubmit={sendInvite}>
                <label className="block">
                  <span className="mb-2 block font-mono-data text-2xs uppercase tracking-label-md text-on-surface-variant/55">Email Address</span>
                  <input
                    value={inviteState.email}
                    onChange={(event) => setInviteState((currentState) => ({ ...currentState, email: event.target.value }))}
                    className="w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all placeholder:text-on-surface-variant/35 focus:ring-primary/35"
                    placeholder="colleague@company.com"
                    type="email"
                    aria-label="Invite member email"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block font-mono-data text-2xs uppercase tracking-label-md text-on-surface-variant/55">Assign Role</span>
                  <select
                    value={inviteState.role}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      const nextRole = event.target.value;

                      if (!isTeamRole(nextRole)) {
                        return;
                      }

                      setInviteState((currentState) => ({ ...currentState, role: nextRole }));
                    }}
                    className="w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all focus:ring-primary/35"
                    aria-label="Assign team role"
                  >
                    {teamRoleOptions.map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {roleOption}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="rounded-2xl bg-surface-container-low p-4">
                  <p className="flex items-start gap-2 text-xs leading-6 text-on-surface-variant/75">
                    <span className="material-symbols-outlined text-sm text-secondary">info</span>
                    Invitees will have limited access until they verify their corporate email address.
                  </p>
                </div>

                <Button className="w-full" type="submit">
                  Send Invite
                </Button>
              </form>

              <div className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-mono-data text-2xs uppercase tracking-label-md text-on-surface-variant/55">Pending Invites</p>
                  <span className="font-mono-data text-2xs uppercase tracking-label-md text-on-surface-variant/45">{pendingInvites.length} total</span>
                </div>

                <div className="space-y-3">
                  {pendingInvites.map((invite, index) => (
                    <div key={invite} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${index % 2 === 0 ? "bg-warning" : "bg-warning/70"}`} />
                        <span className="text-sm text-on-surface-variant">{invite}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => revokeInvite(invite)}
                        className="text-2xs font-semibold uppercase tracking-label-sm text-error transition-colors hover:text-on-error-container"
                        aria-label={`Revoke invite for ${invite}`}
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="bg-surface-container-low" padding="lg">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">gpp_good</span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Security Policy</h4>
                  <p className="mt-2 text-xs leading-6 text-on-surface-variant/72">
                    Two-factor authentication (2FA) is enforced for all <span className="text-primary">Admin</span> and <span className="text-secondary">Editor</span> roles across the workspace.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-surface-container-low" padding="lg">
              <p className="font-mono-data text-2xs uppercase tracking-label-md text-primary">Member Focus</p>
              <p className="mt-2 text-sm text-on-surface-variant/70">{teamActivityMessage}</p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar name={selectedMember.name} size="lg" />
                <div>
                  <p className="font-bold text-on-surface">{selectedMember.name}</p>
                  <p className="font-mono-data text-xs text-on-surface-variant">{selectedMember.email}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className={`rounded-md border px-2 py-1 font-mono-data text-2xs uppercase tracking-label-sm ${teamRoleBadgeClasses[selectedMember.role]}`}>
                  {selectedMember.role}
                </span>
                <Badge variant={selectedMember.presence === "active" ? "success" : selectedMember.presence === "away" ? "warning" : "error"} dot>
                  {selectedMember.statusLabel}
                </Badge>
              </div>
            </Card>
          </aside>
        </section>
      </div>
    </AppLayout>
  );
}
