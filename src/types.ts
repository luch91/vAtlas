export type Status='ACCEPTED'|'REJECTED'|'INCONCLUSIVE';
export interface Artefact {id:string;submitter:string;title:string;source_url:string;category:string;historical_context:string;evidence_urls:string[];evidence_digest:string;created_at:string;assessment_status:Status;assessment_reason:string;evidence_summary:string;assessment_version:string}
export interface PageResult {entries:Artefact[];next_cursor:number;has_more:boolean}
export type TxState='idle'|'confirming'|'submitted'|'finalising'|'finalised'|'failed';
