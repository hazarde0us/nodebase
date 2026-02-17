import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/lib/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { err } from "inngest/types";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    httpRequestChannel().status({
      nodeId: nodeId,
      status: "loading",
    }),
  );

  if (!data.endpoint) {
    await publish(
      httpRequestChannel().status({
        nodeId: nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("HTTP Request Node: No endpoint configured");
  }

  if (!data.variableName) {
    await publish(
      httpRequestChannel().status({
        nodeId: nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Variable name not configured");
  }

  if (!data.method) {
    await publish(
      httpRequestChannel().status({
        nodeId: nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Method not configured");
  }

  try {
    const result = await step.run("http-request", async () => {
      const endpoint = Handlebars.compile(data.endpoint)(context);

      const method = data.method;

      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        const resolved = Handlebars.compile(data.body || "{}")(context);
        JSON.parse(resolved);
        options.body = resolved; // -> to handle invalid json in data.body
        options.headers = {
          "Content-type": "application/json",
        };
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const repsonsePayload = {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };

      return {
        ...context,
        [data.variableName]: repsonsePayload,
      };
    });

    await publish(
      httpRequestChannel().status({
        nodeId: nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      }),
    );

    throw error;
  }
};
