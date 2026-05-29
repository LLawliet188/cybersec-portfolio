export type EnvironmentMode = "idle" | "scan" | "breach" | "intelligence";

export type MissionId =
  | "boot"
  | "identity"
  | "arsenal"
  | "operations"
  | "file"
  | "transmission";

export type MissionNode = {
  id: MissionId;
  phase: string;
  label: string;
  title: string;
  dek: string;
  holdLabel: string;
  narration: string;
  ambient: {
    primary: string;
    secondary: string;
    alert: string;
  };
  signal: string[];
  intel: Array<{
    label: string;
    value: string;
  }>;
};
