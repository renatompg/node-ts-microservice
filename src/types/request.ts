export interface RequestDetails {
    path: string;
    startTime: Date;
    finishTime: Date;
    result: 'success' | 'failure';
  }
  