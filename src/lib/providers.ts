import type { DiscoverabilityProvider } from "./types";
import { demoProvider } from "./demo-provider";

/**
 * Swap live adapters here without changing UI.
 * V1 ships the demo provider. GSC / Serper / LLM implement the same interface.
 */
export const providers: DiscoverabilityProvider[] = [demoProvider];

export const activeProvider: DiscoverabilityProvider = demoProvider;

export function listProviders(): DiscoverabilityProvider[] {
  return providers;
}
