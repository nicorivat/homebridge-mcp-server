import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { McpModule } from '@rekog/mcp-nest';
import { CurtainsToolsModule, LightsToolsModule } from './tools';

@Module({
  imports: [
    ConfigModule.forRoot(),
    McpModule.forRoot({
      name: 'homebridge-mcp',
      version: '1.0.0',
    }),
    LightsToolsModule,
    CurtainsToolsModule,
  ],
})
export class AppModule {}
