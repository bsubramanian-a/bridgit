import { Test, TestingModule } from '@nestjs/testing';
import { BrokerApplicationsCreateController } from './create-applications.controller';

describe('CreateApplicationsController', () => {
  let controller: BrokerApplicationsCreateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrokerApplicationsCreateController],
    }).compile();

    controller = module.get<BrokerApplicationsCreateController>(BrokerApplicationsCreateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
