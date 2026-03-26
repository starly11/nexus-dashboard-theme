import { PRODUCT } from "@/config/product";
import type { SupportTicket, TicketPriority, TicketStatus } from "@/types/support";

export const initialTickets: SupportTicket[] = [
  {
    id: "TK-4421",
    title: "API Rate Limit Latency",
    summary: "We are noticing significant delays in the POST /ingest endpoint for high-volume batches...",
    status: "Open",
    priority: "High",
    service: "API",
    createdAgo: "14m ago",
    createdBy: { name: "David Chen", title: "CTO, DataCloud Inc." },
    assignedTo: "Sarah Jenkins (Support)",
    tags: ["infrastructure", "api-latency", "escalated"],
    messages: [
      {
        id: "msg_1",
        author: "client",
        authorName: "David Chen",
        time: "10:22 AM",
        body:
          "Hi Support team, we're seeing some weird behavior with the ingestion API. Specifically, the response time has jumped from 200ms to over 2.5s when we send batches larger than 50 events. This started happening around 09:00 UTC. Can you investigate?",
      },
      {
        id: "msg_2",
        author: "support",
        authorName: `${PRODUCT.supportTeamName} (Sarah)`,
        time: "10:45 AM",
        body:
          "Hello David, looking into this now. I can see a spike in latency on our Tier-2 nodes. I've escalated this to the infrastructure team for a deeper look. Could you provide your request ID for the last failed or slow batch?",
        emphasis: "support",
      },
      {
        id: "msg_3",
        author: "client",
        authorName: "David Chen",
        time: "10:52 AM",
        body: "Sure thing. Here is the request ID: req_8829x-993-nexus. Let me know if you need any further logs from our side.",
      },
    ],
  },
  {
    id: "TK-4398",
    title: "Billing discrepancy - Q3",
    summary: "The invoice received yesterday does not match the dashboard seat count for our enterprise...",
    status: "Pending",
    priority: "Medium",
    service: "Billing",
    createdAgo: "2h ago",
    createdBy: { name: "Nadia Foster", title: "Finance Lead, VertexOps" },
    assignedTo: "Marcus Aurelius (Eng)",
    tags: ["billing", "seat-count"],
    messages: [
      {
        id: "msg_4",
        author: "client",
        authorName: "Nadia Foster",
        time: "08:10 AM",
        body: "Can you confirm why our billed seat count is showing 28 when the workspace currently shows 24 active seats?",
      },
    ],
  },
  {
    id: "TK-4395",
    title: "SSO Integration Error",
    summary: "Users from the EMEA branch are unable to login via Okta SAML callback. Getting 403...",
    status: "Open",
    priority: "High",
    service: "Security",
    createdAgo: "5h ago",
    createdBy: { name: "Lena Hoffmann", title: "IT Director, EMEA Corp." },
    assignedTo: "Unassigned",
    tags: ["okta", "sso", "auth"],
    messages: [
      {
        id: "msg_5",
        author: "client",
        authorName: "Lena Hoffmann",
        time: "06:05 AM",
        body: "Our EMEA team is receiving 403 responses on the Okta callback route. Can someone help us investigate the SSO configuration?",
      },
    ],
  },
  {
    id: "TK-4380",
    title: "Feature Request: Dark Mode Logo",
    summary: "It would be great if we could upload a specific logo variant for the dark theme view...",
    status: "Closed",
    priority: "Low",
    service: "Branding",
    createdAgo: "1d ago",
    createdBy: { name: "Clara Benson", title: "Design Ops, Northlight" },
    assignedTo: "Sarah Jenkins (Support)",
    tags: ["branding", "feature-request"],
    messages: [
      {
        id: "msg_6",
        author: "client",
        authorName: "Clara Benson",
        time: "Yesterday",
        body: "It would be great if we could upload a separate logo asset specifically for the dark theme experience.",
      },
    ],
  },
];

export const supportStatusOptions: TicketStatus[] = ["Open", "Pending", "Closed"];
export const supportAssigneeOptions = ["Sarah Jenkins (Support)", "Marcus Aurelius (Eng)", "Unassigned"];

export const supportPriorityBadgeVariants: Record<TicketPriority, "error" | "warning" | "default"> = {
  High: "error",
  Medium: "warning",
  Low: "default",
};

export const supportComposerIcons = ["format_bold", "format_italic", "code", "attach_file"] as const;
export const defaultSupportActivityMessage =
  "Audit events, assignee changes, and reply activity appear here during the demo.";
