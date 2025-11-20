import { useNotificationStore } from "@/state/zustand/ZustandStore";

// utility function to trigger notifications
export function notify(message, status = "info") {
  const show = useNotificationStore.getState().show;
  if (!show) {
    console.warn("notify called before store initialization");
    return;
  }
  show(message, status);
}
