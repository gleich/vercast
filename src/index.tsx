import { showToast, ToastStyle } from "@raycast/api";
import { fetchDeployments } from "./vercel";

async function main(): Promise<void> {
  await fetchDeployments();
  showToast(ToastStyle.Success, "Hello World");
}

main();
