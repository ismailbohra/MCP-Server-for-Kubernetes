import { CoreV1Api, AppsV1Api } from "@kubernetes/client-node";
import { getKubeClient } from "../utils/kubeClient.js";
import { z } from "zod";

export interface ListResourcesInput {
  namespace: string;
}

const listResources = {
  name: "list-resources",
  description: "List pods, services, and deployments in a namespace",
  inputSchema: z.object({
    namespace: z.string()
  }),
  async handler({ namespace }: ListResourcesInput) {
    const kc = getKubeClient();
    const coreApi = kc.makeApiClient(CoreV1Api);
    const appsApi = kc.makeApiClient(AppsV1Api);

    try {
      const [pods, services, deployments] = await Promise.all([
        coreApi.listNamespacedPod({ namespace }),
        coreApi.listNamespacedService({ namespace }),
        appsApi.listNamespacedDeployment({ namespace })
      ]);

      return {
        pods: (pods.items ?? [])
          .map((p) => p.metadata?.name)
          .filter(Boolean),
        services: (services.items ?? [])
          .map((s) => s.metadata?.name)
          .filter(Boolean),
        deployments: (deployments.items ?? [])
          .map((d) => d.metadata?.name)
          .filter(Boolean)
      };
    } catch (err: any) {
      return { error: err?.body?.message || err?.message || String(err) };
    }
  }
};

export default listResources;
