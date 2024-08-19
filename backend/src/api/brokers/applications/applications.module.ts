import { BrokerApplicationsListModule } from './list-applications/list-applications.module';
import { Module } from '@nestjs/common';
import { CreateApplicationsModule } from './create-applications/create-applications.module';

@Module({
  imports: [BrokerApplicationsListModule, CreateApplicationsModule]
})
export class BrokerApplicationsModule {}
