import { Module } from '@nestjs/common';
import { BrokerApplicationsCreateController } from './create-applications.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [BrokerApplicationsCreateController],
})
export class CreateApplicationsModule {}
