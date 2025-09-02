import { CoreV1Api } from "@kubernetes/client-node";
import { getKubeClient } from "../utils/kubeClient.js";
import { z } from "zod";

export interface GetLogsInput {
  namespace: string;
  podName: string;
  container?: string;
}

const getLogsInputSchema = z.object({
  namespace: z.string(),
  podName: z.string(),
  container: z.string().optional()
});

const getLogs = {
  name: "get-logs",
  description: "Retrieve logs from a pod",
  inputSchema: getLogsInputSchema,

  async handler({ namespace, podName, container }: GetLogsInput) {
    const kc = getKubeClient();
    const api = kc.makeApiClient(CoreV1Api);

    try {
      const logs = await api.readNamespacedPodLog({
        name: podName,
        namespace,
        container
      });

      return { logs };
    } catch (err: any) {
      return { error: err?.body?.message || err?.message || String(err) };
    }
  }
};

export default getLogs;
