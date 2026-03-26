export type TicketStatus = "Open" | "Pending" | "Closed";
export type TicketPriority = "High" | "Medium" | "Low";
export type MessageAuthor = "client" | "support";

export interface TicketMessage {
  id: string;
  author: MessageAuthor;
  authorName: string;
  time: string;
  body: string;
  emphasis?: "default" | "support";
}

export interface SupportTicket {
  id: string;
  title: string;
  summary: string;
  status: TicketStatus;
  priority: TicketPriority;
  service: string;
  createdAgo: string;
  createdBy: {
    name: string;
    title: string;
  };
  assignedTo: string;
  tags: string[];
  messages: TicketMessage[];
}
