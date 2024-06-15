import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Plans } from './entity/plans.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { Packages } from './entity/packages.schema';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Plans.name, Connections.main) private PlansModel: Model<Plans>,
    @InjectModel(Packages.name, Connections.main)
    private PackagesModel: Model<Packages>,
  ) {}

  async getAllPlans() {
    return await this.PlansModel.find();
  }

  async getAllPackages() {
    return await this.PackagesModel.find();
  }

  async getOnePlan(id: string): Promise<Plans> {
    return await this.PlansModel.findById(id).lean();
  }

  async getOnePackage(id: string): Promise<Packages> {
    return await this.PackagesModel.findById(id).lean();
  }

  async createPlan(plan: CreatePlanDto) {
    return await this.PlansModel.create(plan)
  }
}
