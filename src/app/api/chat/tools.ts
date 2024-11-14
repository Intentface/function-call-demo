import { tool } from "ai";
import { z } from "zod";

export const getWeather = tool({
  description: "Get the weather for a location",
  parameters: z.object({
    city: z.string().describe("The city to get the weather for"),
    unit: z.enum(["C", "F"]).describe("The unit to display the temperature in"),
  }),
});
