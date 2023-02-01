export interface VerifiedContract {
  address: string;
  args: any[];
  compiler_version: string;
  filename: string;
  name: string;
  optimization: boolean;
  runs: number;
  source: any;
  target: string;
  type: string;
}

export interface VerifiedInSquid {
  id: string;
}
