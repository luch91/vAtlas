import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {ExecutionResult,TransactionStatus} from 'genlayer-js/types';
import type {PageResult,TxState} from '../types';
import {feeError,prepareFees} from './fees';

const rpc=import.meta.env.VITE_GENLAYER_RPC_URL||'https://studio.genlayer.com/api';
export const chainId=Number(import.meta.env.VITE_GENLAYER_CHAIN_ID||61999);
export const contractAddress=(import.meta.env.VITE_CONTRACT_ADDRESS||'') as `0x${string}`;
export const explorer=import.meta.env.VITE_EXPLORER_URL||'https://studio.genlayer.com';
type Provider={request(input:{method:string;params?:unknown[]}):Promise<unknown>};
declare global {interface Window {ethereum?:Provider}}
function publicClient(){
  return createClient({chain:studionet,endpoint:rpc});
}
function decode<T>(value:unknown):T { if(typeof value==='string') return JSON.parse(value) as T; return value as T; }
export function configured(){return /^0x[a-fA-F0-9]{40}$/.test(contractAddress)}
export async function listEntries(cursor=0,limit=25,acceptedOnly=false):Promise<PageResult>{
  if(!configured()) return {entries:[],next_cursor:0,has_more:false};
  const result=await publicClient().readContract({address:contractAddress,functionName:'list_entries',args:[cursor,limit,acceptedOnly]});
  return decode<PageResult>(result);
}
export async function entryById(id:string){
  const result=await publicClient().readContract({address:contractAddress,functionName:'get_entry',args:[id]});
  return decode<import('../types').Artefact>(result);
}
export async function entriesBySubmitter(address:string){
  if(!configured()) return {entries:[],next_cursor:0,has_more:false};
  const result=await publicClient().readContract({address:contractAddress,functionName:'get_entries_by_submitter',args:[address,0,25]});
  return decode<PageResult>(result);
}
export async function connectWallet(){
  if(!window.ethereum) throw new Error('A compatible browser wallet is required.');
  const accounts=await window.ethereum.request({method:'eth_requestAccounts'}) as string[];
  const current=Number(await window.ethereum.request({method:'eth_chainId'}));
  return {address:accounts[0],wrongNetwork:current!==chainId};
}
export async function switchNetwork(){
  if(!window.ethereum) throw new Error('Wallet unavailable');
  await window.ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:`0x${chainId.toString(16)}`}]});
}
export async function submitEntry(payload:Record<string,unknown>,onState:(state:TxState,hash?:string)=>void){
  if(!configured()) throw new Error('Contract address is not configured.');
  if(!window.ethereum) throw new Error('A compatible browser wallet is required.');
  onState('confirming');
  const accounts=await window.ethereum.request({method:'eth_requestAccounts'}) as string[];
  const account=accounts[0] as `0x${string}`;
  const client=createClient({chain:studionet,endpoint:rpc,account,provider:window.ethereum});
  await client.connect('studionet');
  const call={address:contractAddress,functionName:'submit_entry',args:[`json:${JSON.stringify(payload)}`],value:0n};
  try {
  const fees=await prepareFees(client as unknown as Parameters<typeof prepareFees>[0],window.ethereum,account,call,chainId);
  const hash=await client.writeContract({...call,...(fees?{fees}: {})} as Parameters<typeof client.writeContract>[0]);
  onState('submitted',hash); onState('finalising',hash);
  const receipt=await client.waitForTransactionReceipt({hash,status:TransactionStatus.FINALIZED});
  if(receipt.txExecutionResultName!==ExecutionResult.FINISHED_WITH_RETURN) throw new Error(`Transaction finalized without a successful contract execution (${receipt.txExecutionResultName}).`);
  onState('finalised',hash); return hash as string;
  } catch(error) { throw feeError(error); }
}
