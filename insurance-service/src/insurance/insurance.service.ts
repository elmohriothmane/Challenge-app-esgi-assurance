import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Insurance } from './schemas/insurance.schema';
import { Beneficiary } from './schemas/beneficiary.schema';

@Injectable()
export class InsuranceService {
  constructor(
    @InjectModel(Insurance.name) private insuranceModel: Model<Insurance>,
    @InjectModel(Beneficiary.name) private beneficiaryModel: Model<Beneficiary>,
  ) {}

  async createInsurance(insuranceDto: any): Promise<Insurance> {
    const newInsurance = new this.insuranceModel(insuranceDto);
    return newInsurance.save();
  }

  async getInsurances(): Promise<Insurance[]> {
    console.log("ok")
    return this.insuranceModel.find().exec();
  }

  async getInsuranceById(id: string): Promise<Insurance> {
    return this.insuranceModel.findById(id).exec();
  }

  async updateInsurance(id: string, insuranceDto: any): Promise<Insurance> {
    return this.insuranceModel.findByIdAndUpdate(id, insuranceDto, { new: true }).exec();
  }

  async deleteInsurance(id: string): Promise<Insurance> {
    return this.insuranceModel.findByIdAndDelete(id).exec();
  }


  async createBeneficiary(beneficiaryDto: any): Promise<Beneficiary> {
    const newBeneficiary = new this.beneficiaryModel(beneficiaryDto);
    return newBeneficiary.save();
  }

  async getBeneficiaries(): Promise<Beneficiary[]> {
    return this.beneficiaryModel.find().exec();
  }

  async getBeneficiaryById(id: string): Promise<Beneficiary> {
    return this.beneficiaryModel.findById(id).exec();
  }

  async updateBeneficiary(id: string, beneficiaryDto: any): Promise<Beneficiary> {
    return this.beneficiaryModel.findByIdAndUpdate(id, beneficiaryDto, { new: true }).exec();
  }

  async deleteBeneficiary(id: string): Promise<Beneficiary> {
    return this.beneficiaryModel.findByIdAndDelete(id).exec();
  }
}