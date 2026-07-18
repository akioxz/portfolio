export interface CertificationEntry {
  date: string;
  title: string;
  issuer: string;
  credentialId?: string;
  thumbnail?: string;
}

export const certificationsData: CertificationEntry[] = [];
