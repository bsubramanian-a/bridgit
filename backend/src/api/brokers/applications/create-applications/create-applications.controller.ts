import { APPLICATION_REPOSITORY } from 'src/common/constants/repositories';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Application } from 'src/models/applications/application.entity';
import { ApplicationDto, BrokerApplicationPostResponseDto } from '../list-applications/list-applications.dto';
import { BrokerDto } from 'src/models/brokers/broker.dto';
import { BrokerGuard } from '../../broker.guard';
import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { INTERNAL_SERVER_ERROR } from 'src/common/constants/response-messages';
import { InternalServerErrorResponseDto } from 'src/common/responses';
import { ApplicationStatus } from 'src/enums/application-status.enum';
import User from 'src/common/decorators/user';
import { formatResponseTable } from 'src/common/swagger';
import { AuthGuard } from '@nestjs/passport';

/**
 * Broker API endpoint for creating new applications.
 */
@Controller('brokers/applications')
@ApiTags('Broker API')
export class BrokerApplicationsCreateController {
  /**
   * Initializes the controller
   * @param applicationEntity {Application} Database entity for querying and creating applications
   */
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private applicationEntity: typeof Application,
  ) {}

  /**
   * Creates a new application for the broker.
   * @param user {BrokerDto} User information from the request
   * @param body {ApplicationDto} Application details to be created
   * @returns {Promise<Application>} The created application details
   */
  @Post('create-applications')
  @UseGuards(BrokerGuard)
  @ApiBearerAuth('BROKER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new application',
    description: 'Creates a new application for the broker',
  })
  @ApiCreatedResponse({
    type: Application,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorResponseDto,
    description: `Returns \`${INTERNAL_SERVER_ERROR}\` when the application creation fails`,
  })
  @ApiBadRequestResponse({
    type: ApplicationDto,
    description: formatResponseTable({}),
  })
  async create(@User() user: BrokerDto, @Body() body: ApplicationDto): Promise<BrokerApplicationPostResponseDto> {
    try {
      console.log('body', body);
      await this.applicationEntity.create({
        ...body,
        status: ApplicationStatus.Submitted,
        brokerId: user.id,
      });

      const avgLoanAmount = await this.applicationEntity.getAverageLoanAmount();
      const loanAmount = body.loanAmount !== avgLoanAmount ? body.loanAmount : null;

      return {
        success: true,
        loanAmount
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
