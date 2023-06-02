import {
  Req,
  UseGuards,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Inject,
  UseInterceptors,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreateBeneficiaryDto,
  UpdateBeneficiaryDto,
} from './dtos/beneficiary.dto';
import {
  CreateInsuranceDto,
  CreateModifiedInsuranceDto,
  UpdateInsuranceDto,
} from './dtos/insurance.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Insurance')
@Controller()
export class InsuranceController {
  constructor(
    @Inject('INSURANCE_SERVICE') private insuranceServiceClient: ClientProxy,
    @Inject('QUOTE_SERVICE') private readonly quoteServiceClient: ClientProxy,
    @Inject('USER_SERVICE') private userServiceClient: ClientProxy,
  ) {}

  @Post('insurance')
  @UsePipes(ValidationPipe)
  async createInsurance(@Body() insuranceDto: CreateInsuranceDto): Promise<any> {
    try {
      const createdInsurance = await this.insuranceServiceClient
        .send({ cmd: 'createInsurance' }, insuranceDto)
        .toPromise();

      return createdInsurance;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }


  @Get('insurance')
  async getInsurances(): Promise<any> {
    try {
      const insurances = await this.insuranceServiceClient
        .send({ cmd: 'getInsurances' }, '')
        .toPromise();

      return insurances;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }


  @Get('insurance/:id')
async getInsuranceById(@Param('id') id: string): Promise<any> {
  try {
    const insurance = await this.insuranceServiceClient
      .send({ cmd: 'getInsuranceById' }, id)
      .toPromise();

    if (!insurance) {
      throw new NotFoundException(`Insurance with ID "${id}" not found`);
    }

    return insurance;
  } catch (err) {
    if (err instanceof NotFoundException) {
      throw new NotFoundException(err.message);
    }
    throw new BadRequestException(err.message);
  }
}



@Put('insurance/:id')
@UsePipes(ValidationPipe)
async updateInsurance(
  @Param('id') id: string,
  @Body() insuranceDto: UpdateInsuranceDto,
): Promise<any> {
  try {
    const insurance = await this.insuranceServiceClient
      .send({ cmd: 'getInsuranceById' }, id)
      .toPromise();

    if (!insurance) {
      throw new NotFoundException(`Insurance with ID "${id}" not found`);
    }

    const updatedInsurance = await this.insuranceServiceClient
      .send({ cmd: 'updateInsurance' }, { id, ...insuranceDto })
      .toPromise();

    if (!updatedInsurance) {
      throw new NotFoundException(`Insurance with ID "${id}" could not be updated`);
    }

    return updatedInsurance;
  } catch (err) {
    if (err instanceof NotFoundException) {
      throw new NotFoundException(err.message);
    }
    throw new BadRequestException(err.message);
  }
}




  @Delete('insurance/:id')
async deleteInsurance(@Param('id') id: string): Promise<any> {
  try {
    const deletedInsurance = await this.insuranceServiceClient
      .send({ cmd: 'deleteInsurance' }, id)
      .toPromise();

    if (!deletedInsurance) {
      throw new NotFoundException(`Insurance with ID "${id}" not found or could not be deleted`);
    }

    return deletedInsurance;
  } catch (err) {
    if (err instanceof NotFoundException) {
      throw new NotFoundException(err.message);
    }
    throw new BadRequestException(err.message);
  }
}



  @Get('beneficiary/:id/insurances')
async getBeneficiaryWithInsurances(@Param('id') id: string): Promise<any> {
  try {
    const beneficiaryWithInsurances = await this.insuranceServiceClient
      .send({ cmd: 'getBeneficiaryWithInsurances' }, id)
      .toPromise();

    if (!beneficiaryWithInsurances) {
      throw new NotFoundException(`Beneficiary with ID "${id}" not found`);
    }

    return beneficiaryWithInsurances;
  } catch (err) {
    if (err instanceof NotFoundException) {
      throw new NotFoundException(err.message);
    }
    throw new BadRequestException(err.message);
  }
}



  @Get('beneficiary/:id')
async getBeneficiaryById(@Param('id') id: string): Promise<any> {
  try {
    const beneficiary = await this.insuranceServiceClient
      .send({ cmd: 'getBeneficiaryById' }, id)
      .toPromise();

    if (!beneficiary) {
      throw new NotFoundException(`Beneficiary with ID "${id}" not found`);
    }

    return beneficiary;
  } catch (err) {
    if (err instanceof NotFoundException) {
      throw new NotFoundException(err.message);
    }
    throw new BadRequestException(err.message);
  }
}



  @Get('beneficiaries')
async getBeneficiaries(): Promise<any> {
  try {
    const beneficiaries = await this.insuranceServiceClient
      .send({ cmd: 'getBeneficiaries' }, {})
      .toPromise();

    if (!beneficiaries) {
      throw new NotFoundException('No beneficiaries found');
    }

    return beneficiaries;
  } catch (err) {
    if (err instanceof NotFoundException) {
      throw new NotFoundException(err.message);
    }
    throw new BadRequestException(err.message);
  }
}



  @Post('beneficiary')
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'justificatifDomicile', maxCount: 1 },
      { name: 'permis', maxCount: 1 },
    ]),
  )
  async createBeneficiary(
    @Body() beneficiaryDto: CreateBeneficiaryDto,
    @UploadedFiles()
    files: {
      justificatifDomicile: Express.Multer.File[];
      permis: Express.Multer.File[];
    },
  ): Promise<any> {
    try {
      const fileContents = {
        justificatifDomicile: files.justificatifDomicile[0]
          ? files.justificatifDomicile[0].buffer.toString('base64')
          : null,
        permis: files.permis[0]
          ? files.permis[0].buffer.toString('base64')
          : null,
      };
      const beneficiary = await this.insuranceServiceClient
        .send({ cmd: 'createBeneficiary' }, { beneficiaryDto, fileContents })
        .toPromise();

      return beneficiary;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }


  @Put('beneficiary/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'justificatifDomicile', maxCount: 1 },
      { name: 'permis', maxCount: 1 },
    ]),
  )
  async updateBeneficiary(
  @Param('id') id: string,
  @Body() beneficiaryDto: UpdateBeneficiaryDto,
  @UploadedFiles()
  files: {
    justificatifDomicile: Express.Multer.File[];
    permis: Express.Multer.File[];
  },
): Promise<any> {
  try {
    const beneficiary = await this.insuranceServiceClient
      .send({ cmd: 'getBeneficiaryById' }, id)
      .toPromise();

    if (!beneficiary) {
      throw new NotFoundException(`Beneficiary with ID "${id}" not found.`);
    }

    const fileContents = {
      justificatifDomicile:
        files.justificatifDomicile && files.justificatifDomicile[0]
          ? files.justificatifDomicile[0].buffer.toString('base64')
          : null,
      permis:
        files.permis && files.permis[0]
          ? files.permis[0].buffer.toString('base64')
          : null,
    };

    if (!fileContents.justificatifDomicile || !fileContents.permis) {
      throw new BadRequestException('File not uploaded');
    }

    const updatedBeneficiary = await this.insuranceServiceClient
      .send(
        { cmd: 'updateBeneficiary' },
        { id, beneficiaryDto, fileContents },
      )
      .toPromise();

    return updatedBeneficiary;
  } catch (err) {
    if (err.message.includes("Quote creation failed")) {
      throw new BadRequestException('Quote creation failed');
    }
    throw err;
  }
}


@Post('beneficiary-insurance')
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard)
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'justificatifDomicile', maxCount: 1 },
    { name: 'permis', maxCount: 1 },
  ]),
)
async createBeneficiaryInsurance(
  @Req() req,
  @Body() createModifiedInsuranceDto: CreateModifiedInsuranceDto,
  @UploadedFiles()
  files: {
    justificatifDomicile: Express.Multer.File[];
    permis: Express.Multer.File[];
  },
): Promise<any> {
  try {
    const userData = await this.userServiceClient
      .send({ cmd: 'findUserById' }, req.user.sub)
      .toPromise();

    if (!userData) {
      throw new NotFoundException(`User with ID "${req.user.sub}" not found.`);
    }

    let currentBeneficiary = await this.insuranceServiceClient
      .send({ cmd: 'getBeneficiaryByUserId' }, req.user.sub)
      .toPromise();

    const fileContents = {
      justificatifDomicile: files.justificatifDomicile[0]
        ? files.justificatifDomicile[0].buffer.toString('base64')
        : null,
      permis: files.permis[0]
        ? files.permis[0].buffer.toString('base64')
        : null,
    };

    if (!fileContents.justificatifDomicile || !fileContents.permis) {
      throw new BadRequestException('Files not uploaded');
    }

    if (!currentBeneficiary) {
      const beneficiaryInsuranceDto: CreateBeneficiaryDto = {
        firstName: userData.firstname,
        lastName: userData.lastname,
        postalAddress:
          userData.adresse + ' ' + userData.codeCity + ' ' + userData.city,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        userId: userData['_id'],
      };

      const beneficiary = await this.insuranceServiceClient
        .send(
          { cmd: 'createBeneficiary' },
          { beneficiaryDto: beneficiaryInsuranceDto, fileContents },
        )
        .toPromise();

      currentBeneficiary = beneficiary;
    }

    const relatedQuote = await this.quoteServiceClient
      .send({ cmd: 'getQuoteById' }, createModifiedInsuranceDto.quoteId)
      .toPromise();

    if (!relatedQuote) {
      throw new NotFoundException(`Quote with ID "${createModifiedInsuranceDto.quoteId}" not found.`);
    }

    const insuranceDto: CreateInsuranceDto = {
      insuranceType: relatedQuote.insuranceType,
      coverageStartDate: createModifiedInsuranceDto.coverageStartDate,
      coverageEndDate: createModifiedInsuranceDto.coverageEndDate,
      insurancePremium: relatedQuote.insurancePremium,
      insuranceStatus: 'active',
      quoteId: relatedQuote.id,
      dossierNumber: relatedQuote.quoteNumber,
      vehicleId: relatedQuote.vehicle.id,
      beneficiary: currentBeneficiary['_id'],
    };

    return this.insuranceServiceClient
      .send({ cmd: 'createInsurance' }, insuranceDto)
      .toPromise();
  } catch (err) {
    if (err.message.includes("Insurance creation failed")) {
      throw new BadRequestException('Insurance creation failed');
    }
    throw err;
  }
}

}
