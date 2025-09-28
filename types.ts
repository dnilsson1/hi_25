export interface Mission {
  label: string;
  templateCode: string;
  position?: string;
}

export type StatusType = 'idle' | 'loading' | 'success' | 'error';

export interface Status {
  type: StatusType;
  message: string;
}
