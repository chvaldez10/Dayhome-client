import { defineConfig } from "cypress";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

interface FileStats {
  exists: boolean;
  modifiedAt: number;
  size: number;
}

interface WaitForFreshFileArgs {
  filePath: string;
  previousStats: FileStats;
  timeoutMs: number;
  pollIntervalMs?: number;
}

function getFileStats(filePath: string): FileStats {
  if (!fs.existsSync(filePath)) {
    return {
      exists: false,
      modifiedAt: 0,
      size: 0,
    };
  }

  const stats = fs.statSync(filePath);

  return {
    exists: true,
    modifiedAt: stats.mtimeMs,
    size: stats.size,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        getFileStats(filePath: string) {
          return getFileStats(filePath);
        },
        async waitForFreshFile({
          filePath,
          previousStats,
          timeoutMs,
          pollIntervalMs = 250,
        }: WaitForFreshFileArgs) {
          const startedAt = Date.now();

          while (Date.now() - startedAt <= timeoutMs) {
            const currentStats = getFileStats(filePath);
            const fileChanged =
              currentStats.exists &&
              currentStats.size > 0 &&
              (!previousStats.exists ||
                currentStats.modifiedAt > previousStats.modifiedAt ||
                currentStats.size !== previousStats.size);

            if (fileChanged) {
              return currentStats;
            }

            await sleep(pollIntervalMs);
          }

          throw new Error(`Timed out waiting for a fresh CSV download at ${filePath}.`);
        },
      });

      // Adding environment variables to Cypress config
      config.env.username = process.env.CRAFTS_USERNAME;
      config.env.password = process.env.CRAFTS_PASSWORD;
      config.env.attendancePageUrl = process.env.CRAFTS_ATTENDANCE_URL;
      config.env.expectedCraftsCsv = process.env.EXPECTED_CRAFTS_CSV;

      return config;
    },
    baseUrl: process.env.CRAFTS_LOGIN_URL,
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 7000,
    chromeWebSecurity: false,
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
