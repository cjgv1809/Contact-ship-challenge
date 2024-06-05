export type Message = {
  content: string;
  role: "agent" | "user";
  start: number;
  end: number;
};
