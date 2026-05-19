/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Link {
  label: string;
  url: string;
  primary: boolean;
}

export interface Supplier {
  id: number;
  kana: string;
  name: string;
  desc: string;
  links: Link[];
}

export interface MonitoringResult {
  url: string;
  status: number;
  lastModified: string | null;
  etag: string | null;
  contentLength: string | null;
  checkedAt: string;
}

export interface MonitoringHistory {
  id: string;
  supplierName: string;
  url: string;
  type: "changed" | "no_change" | "error";
  details: string;
  timestamp: string;
  prevValue?: string;
  newValue?: string;
}
