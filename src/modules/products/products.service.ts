import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Plans } from './entity/plans.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { Packages } from './entity/packages.schema';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UserPlan } from './entity/userPlan.schema';
import { CreateUserPlanDto } from './dto/create-user-plan.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Plans.name, Connections.main) private plansModel: Model<Plans>,
    @InjectModel(UserPlan.name, Connections.main)
    private userPlanModel: Model<UserPlan>,
    @InjectModel(Packages.name, Connections.main)
    private PackagesModel: Model<Packages>,
  ) {}

  async getAllPlans() {
    return await this.plansModel.find();
  }

  async getAllPackages() {
    return await this.PackagesModel.find();
  }

  async getOnePlan(id: string): Promise<Plans> {
    return await this.plansModel.findById(id).lean();
  }

  async getOnePackage(id: string): Promise<Packages> {
    return await this.PackagesModel.findById(id).lean();
  }

  async createPlan(plan: CreatePlanDto) {
    return await this.plansModel.create(plan);
  }

  async getUserPlan(userId: string, active?: boolean) {
    const now = new Date(Date.now());
    return await this.userPlanModel.findOne({
      userId,
      startDate: {
        $lte: now,
      },
      ...(active ? { dueDate: { $gte: now } } : {}),
    });
  }

  async createUserPlan(userPlan: CreateUserPlanDto) {
    return await this.userPlanModel.create(userPlan);
  }
}
