import type iziToast from "izitoast";

declare global {
  interface Window {
    iziToast: typeof iziToast;
  }
}

export {};
