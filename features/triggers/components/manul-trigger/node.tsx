import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { UseNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manul-trigger";
import { fetchManualRealtimeToken } from "./actions";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = UseNodeStatus({
    nodeId: props.id,
    channel: MANUAL_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchManualRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        status={nodeStatus}
        icon={MousePointerIcon}
        name="When clicking 'Execute Workflow'"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
