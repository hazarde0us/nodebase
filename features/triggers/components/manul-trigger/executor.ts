import type { NodeExecutor } from "@/features/executions/lib/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  //TODO: Publish "loading" state for manual trigger

  const result = await step.run("manul-trigger", async () => context);

  //TODO: Publish "success" state for manual trigger

  return result;
};
