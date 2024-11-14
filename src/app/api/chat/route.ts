import { ToolInvocation, streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
// import { getWeather } from "./tools";

interface Message {
  role: "user" | "assistant";
  content: string;
  toolInvocations?: ToolInvocation[];
}

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: "You are a helpful assistant.",
    messages,
    maxSteps: 10,
    experimental_toolCallStreaming: true,
    tools: {
      getCityLatLng: tool({
        description: "Get latitude and longitude for a city",
        parameters: z.object({
          city: z
            .string()
            .describe("The city to get the latitude and longitude for"),
        }),
        execute: async ({ city }) => {
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=3&language=en&format=json`
          );
          const data = await res.json();
          return data;
        },
      }),
      getWeather: tool({
        description:
          "Get the weather for a location, use getCity to get the latitude and longitude, apparent temperature is the temperature that it feels like or 'tuntuu kuin' in Finnish",
        parameters: z.object({
          latitude: z.number().describe("The latitude of the location"),
          longitude: z.number().describe("The longitude of the location"),
        }),
        execute: async ({ latitude, longitude }) => {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature&forecast_days=1`
          );
          const data = await res.json();
          return data;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
