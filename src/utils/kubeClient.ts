import { KubeConfig } from "@kubernetes/client-node";

let kc: KubeConfig | undefined;

export function getKubeClient(): KubeConfig {
  if (!kc) {
    kc = new KubeConfig();
    kc.loadFromDefault();
  }
  return kc;
}
