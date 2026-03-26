"use client";

import React, { startTransition, useDeferredValue, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  defaultSupportActivityMessage,
  initialTickets,
  supportAssigneeOptions,
  supportComposerIcons,
  supportPriorityBadgeVariants,
  supportStatusOptions,
} from "@/data/support";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PRODUCT } from "@/config/product";
import type { SupportTicket, TicketStatus } from "@/types/support";

export default function SupportPage(): React.JSX.Element {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [activeStatus, setActiveStatus] = useState<TicketStatus>("Open");
  const [selectedTicketId, setSelectedTicketId] = useState<string>(initialTickets[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [newTag, setNewTag] = useState("");
  const [supportActivityMessage, setSupportActivityMessage] = useState(defaultSupportActivityMessage);

  const deferredSearchQuery = useDeferredValue(searchQuery);
  const filteredTickets = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesStatus = ticket.status === activeStatus;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [ticket.title, ticket.summary, ticket.id, ticket.service, ticket.createdBy.name]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    });
  }, [activeStatus, deferredSearchQuery, tickets]);

  const selectedTicket =
    filteredTickets.find((ticket) => ticket.id === selectedTicketId) ??
    tickets.find((ticket) => ticket.id === selectedTicketId) ??
    tickets[0];

  const sendReply = (): void => {
    const trimmedReply = replyText.trim();
    if (!trimmedReply) {
      return;
    }

    startTransition(() => {
      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.id === selectedTicket.id
            ? {
                ...ticket,
                status: "Pending",
                messages: [
                  ...ticket.messages,
                  {
                    id: `msg_${Date.now()}`,
                    author: "support",
                    authorName: `${PRODUCT.supportTeamName} (Sarah)`,
                    time: "Just now",
                    body: trimmedReply,
                    emphasis: "support",
                  },
                ],
              }
            : ticket
        )
      );
      setReplyText("");
      setActiveStatus("Pending");
    });
    setSupportActivityMessage(`Reply queued for ${selectedTicket.id}. The ticket has moved to Pending.`);
  };

  const updateAssignee = (value: string): void => {
    setSupportActivityMessage(`${selectedTicket.id} is now assigned to ${value}.`);
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === selectedTicket.id ? { ...ticket, assignedTo: value } : ticket
      )
    );
  };

  const addTag = (): void => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (!trimmedTag || selectedTicket.tags.includes(trimmedTag)) {
      return;
    }

    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === selectedTicket.id ? { ...ticket, tags: [...ticket.tags, trimmedTag] } : ticket
      )
    );
    setNewTag("");
    setSupportActivityMessage(`Added tag "${trimmedTag}" to ${selectedTicket.id}.`);
  };

  const removeTag = (tag: string): void => {
    setSupportActivityMessage(`Removed tag "${tag}" from ${selectedTicket.id}.`);
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === selectedTicket.id ? { ...ticket, tags: ticket.tags.filter((currentTag) => currentTag !== tag) } : ticket
      )
    );
  };

  const toggleClosed = (): void => {
    setSupportActivityMessage(
      `${selectedTicket.id} has been marked ${selectedTicket.status === "Closed" ? "open" : "closed"}.`
    );
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === selectedTicket.id
          ? { ...ticket, status: ticket.status === "Closed" ? "Open" : "Closed" }
          : ticket
      )
    );
    setActiveStatus(selectedTicket.status === "Closed" ? "Open" : "Closed");
  };

  const openAuditLog = (): void => {
    setSupportActivityMessage(`Audit history for ${selectedTicket.id} is ready for review in the full support workflow.`);
  };

  return (
    <AppLayout
      title="Support"
      showHeader={false}
    >
      <div className="-mx-4 -my-4 flex h-[calc(100vh-2rem)] overflow-hidden bg-surface lg:-mx-6">
        <section className="hidden w-80 shrink-0 border-r border-outline-variant/10 bg-surface-container-low lg:flex lg:flex-col">
          <div className="border-b border-outline-variant/10 p-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">search</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-xl bg-surface-container-lowest px-9 py-2 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all placeholder:opacity-30 focus:ring-primary/35"
                placeholder="Filter tickets..."
                type="text"
                aria-label="Filter support tickets"
              />
            </div>
            <div className="mt-4 flex gap-1 rounded-xl bg-surface-container-lowest p-1">
              {supportStatusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatus(status)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                    activeStatus === status
                      ? "bg-surface-container-high text-primary"
                      : "text-on-surface-variant/60 hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                  aria-label={`Show ${status.toLowerCase()} tickets`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="scrollbar-thin flex-1 overflow-y-auto">
            {filteredTickets.map((ticket) => {
              const isSelected = ticket.id === selectedTicket.id;

              return (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full border-b border-outline-variant/5 p-4 text-left transition-colors ${
                    isSelected
                      ? "border-l-4 border-l-primary bg-surface-container"
                      : "hover:bg-surface-container-low"
                  }`}
                >
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <h3 className="truncate pr-2 text-sm font-bold text-on-surface">{ticket.title}</h3>
                    <Badge variant={supportPriorityBadgeVariants[ticket.priority]} size="sm">
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-on-surface-variant/55">{ticket.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-data text-2xs uppercase tracking-label-md text-on-surface-variant/25">#{ticket.id}</span>
                    <span className="flex items-center gap-1 text-2xs text-on-surface-variant/35">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {ticket.createdAgo}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="border-b border-outline-variant/10 bg-surface-container-lowest/50 px-6 py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-on-surface">{selectedTicket.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-on-surface-variant/55">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">folder_open</span>
                    {selectedTicket.service}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">chat_bubble</span>
                    {selectedTicket.messages.length} messages
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-xl p-2 transition-colors hover:bg-surface-container"
                  aria-label="Star ticket"
                >
                  <span className="material-symbols-outlined">star</span>
                </button>
                <button
                  type="button"
                  className="rounded-xl p-2 transition-colors hover:bg-surface-container"
                  aria-label="Open more actions"
                >
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>
          </div>

          <div className="scrollbar-thin flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="mx-auto max-w-4xl space-y-8">
              {selectedTicket.messages.map((message) => {
                const isSupport = message.author === "support";

                return (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${isSupport ? "ml-auto max-w-3xl flex-row-reverse" : "max-w-3xl"}`}
                  >
                    {isSupport ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                        <span className="material-symbols-outlined">support_agent</span>
                      </div>
                    ) : (
                      <Avatar name={message.authorName} size="md" className="rounded-full" />
                    )}

                    <div className={`space-y-2 ${isSupport ? "text-right" : ""}`}>
                      <div className={`flex items-center gap-2 ${isSupport ? "justify-end" : ""}`}>
                        {isSupport ? null : <span className="text-sm font-bold text-on-surface">{message.authorName}</span>}
                        <span className="font-mono-data text-2xs text-on-surface-variant/40">{message.time}</span>
                        {isSupport ? <span className="text-sm font-bold text-primary">{message.authorName}</span> : null}
                      </div>
                      <div
                        className={`rounded-xl p-4 text-sm leading-relaxed ${
                          isSupport
                            ? "rounded-tr-none border border-primary/20 bg-primary/10 text-primary-fixed italic"
                            : "rounded-tl-none bg-surface-container text-on-surface/90"
                        }`}
                      >
                        {message.body}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-outline-variant/10 bg-surface-container-low p-6">
            <div className="mx-auto max-w-4xl rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-panel transition-all focus-within:border-primary/50">
              <div className="flex items-center gap-2 border-b border-outline-variant/10 bg-surface-container/50 px-4 py-2">
                {supportComposerIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className="rounded-lg p-1.5 transition-colors hover:bg-surface-container-high"
                    aria-label={icon.replace("_", " ")}
                  >
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                  </button>
                ))}
                <div className="ml-auto">
                  <span className="font-mono-data text-2xs italic text-on-surface-variant/30">{supportActivityMessage}</span>
                </div>
              </div>
              <textarea
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                className="h-32 w-full resize-none bg-transparent p-4 text-sm leading-relaxed text-on-surface outline-none placeholder:text-on-surface-variant/30"
                placeholder="Type your reply here..."
                aria-label="Support reply"
              />
              <div className="flex items-center justify-between bg-surface-container/30 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="glow-dot-success h-2 w-2 rounded-full bg-success" />
                  <span className="font-mono-data text-2xs text-on-surface-variant/40">Agent online</span>
                </div>
                <Button onClick={sendReply}>
                  Send Reply
                  <span className="material-symbols-outlined text-sm text-on-primary">send</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="hidden w-72 shrink-0 border-l border-outline-variant/10 bg-surface-container-low xl:flex xl:flex-col">
          <div className="space-y-8 p-6">
            <div className="space-y-3">
              <h4 className="font-mono-data text-2xs uppercase tracking-label-md text-on-surface-variant/40">Created By</h4>
              <div className="flex items-center gap-3 rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-3">
                <Avatar name={selectedTicket.createdBy.name} size="md" className="rounded-full" />
                <div>
                  <p className="text-sm font-bold text-on-surface">{selectedTicket.createdBy.name}</p>
                  <p className="text-tiny text-on-surface-variant/40">{selectedTicket.createdBy.title}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono-data text-2xs uppercase tracking-label-md text-on-surface-variant/40">Assigned To</h4>
              <div className="relative">
                <select
                  value={selectedTicket.assignedTo}
                  onChange={(event) => updateAssignee(event.target.value)}
                  className="w-full appearance-none rounded-2xl border border-outline-variant/20 bg-surface-container px-3 py-3 text-sm text-on-surface outline-none transition-all focus:ring-1 focus:ring-primary/35"
                  aria-label="Assign support ticket"
                >
                  {supportAssigneeOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant/40">expand_more</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-mono-data text-2xs uppercase tracking-label-md text-on-surface-variant/40">Priority</h4>
                <div className="flex items-center gap-2 rounded-xl border border-error/20 bg-error-container/10 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-error" />
                  <span className="font-mono-data text-tiny font-bold uppercase text-error">{selectedTicket.priority}</span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-mono-data text-2xs uppercase tracking-label-md text-on-surface-variant/40">Service</h4>
                <div className="flex items-center gap-2 rounded-xl border border-outline-variant/10 bg-surface-container px-3 py-2">
                  <span className="font-mono-data text-tiny font-bold uppercase text-on-surface/70">{selectedTicket.service}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono-data text-2xs uppercase tracking-label-md text-on-surface-variant/40">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTicket.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-lg bg-surface-container px-2 py-1 font-mono-data text-2xs uppercase tracking-label-xs text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                    aria-label={`Remove tag ${tag}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newTag}
                  onChange={(event) => setNewTag(event.target.value)}
                  className="min-w-0 flex-1 rounded-xl bg-surface-container-lowest px-3 py-2 text-xs text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all focus:ring-primary/35"
                  placeholder="Add tag"
                  type="text"
                  aria-label="Add support tag"
                />
                <Button variant="ghost" size="sm" onClick={addTag}>
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="secondary" className="w-full" onClick={openAuditLog}>
                History
                <span className="material-symbols-outlined text-sm text-secondary">history</span>
              </Button>
              <Button
                variant="secondary"
                className={`w-full ${selectedTicket.status === "Closed" ? "border-success/20 text-success hover:text-success" : "border-error/20 text-error hover:text-error"}`}
                onClick={toggleClosed}
              >
                {selectedTicket.status === "Closed" ? "Reopen Ticket" : "Close Ticket"}
                <span className="material-symbols-outlined text-sm">
                  {selectedTicket.status === "Closed" ? "lock_open" : "lock"}
                </span>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
