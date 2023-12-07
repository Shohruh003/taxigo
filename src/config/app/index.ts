import { registerAs } from "@nestjs/config";
import 'dotenv/config';
interface AppConfig {
  host: string;
  port: number;
}

export const AppConfig = registerAs('app', (): AppConfig => ({
    host: process.env.APP_HOST || undefined,
    port: Number(process.env.APP_PORT) || undefined,
  })
)