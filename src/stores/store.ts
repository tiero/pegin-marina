import { writable } from 'svelte/store'

export interface Deposit {
  txid: string;
}

export interface PeginInfo {
  claimScript: string;
  peginAddress: string;
  deposits: Deposit[];
}

export type PeginStore = Record<string, PeginInfo>;

// Set the stored value or a sane default.
export const peginStore = writable<PeginStore>(JSON.parse(localStorage.getItem("peginStore")) || {});


// Anytime the store changes, update the local storage value
peginStore.subscribe((value) => {
  localStorage.peginStore = JSON.stringify(value)
});