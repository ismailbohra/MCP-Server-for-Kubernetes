import * as k8s from "@kubernetes/client-node";
import { getKubeClient } from "../utils/kubeClient.js";
import { z } from "zod";

export interface ScaleDeploymentInput {
  namespace: string;
  name: string;
  replicas: number;
}

const scaleDeploymentInputSchema = z.object({
  namespace: z.string(),
  name: z.string(),
  replicas: z.number(),
});

const scaleDeployment = {
  name: "scale-deployment",
  description: "Scale a Kubernetes deployment up or down",
  inputSchema: scaleDeploymentInputSchema,
  async handler({ namespace, name, replicas }: ScaleDeploymentInput) {
    const kc = getKubeClient();
    const api = kc.makeApiClient(k8s.AppsV1Api);

    // Strategic/Merge patch with header
    const body = { spec: { replicas } } as unknown as object;

    try {
      await api.patchNamespacedDeployment({ name, namespace, body });
      return { message: `Deployment ${name} scaled to ${replicas} replicas.` };
    } catch (err: any) {
      return { error: err?.body?.message || err?.message || String(err) };
    }
  },
};

export default scaleDeployment;
