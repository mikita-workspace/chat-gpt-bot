export type CsmTopicResponse = {
  id: string;
  isPrivate: boolean;
  key: string;
  name: Record<string, string>;
};

export type CsmIssueResponse = { ticketNumber: string; status: string };
