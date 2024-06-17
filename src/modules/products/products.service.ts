import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Plan } from './entity/plan.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { Packages } from './entity/packages.schema';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanExchange } from './entity/plan-exchange.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Plan.name, Connections.main) private planModel: Model<Plan>,
    @InjectModel(PlanExchange.name, Connections.main)
    private planExchangeModel: Model<PlanExchange>,
    @InjectModel(Packages.name, Connections.main)
    private PackagesModel: Model<Packages>,
  ) {}

  async getAllPlanExchange() {
    return await this.planExchangeModel.find();
  }

  async getAllPlans() {
    return await this.planModel.find();
  }

  async getAllPackages() {
    return await this.PackagesModel.find();
  }

  async getOnePlan(id: string): Promise<Plan> {
    return await this.planModel.findById(id).lean();
  }

  async getPlanByName(name: string): Promise<Plan> {
    return await this.planModel.findOne({ name }).lean();
  }

  async getPlanExchangeByName(name: string) {
    return await this.planExchangeModel.findOne({ name });
  }

  async getOnePlanExchange(id: string) {
    return await this.planExchangeModel.findById(id);
  }

  async getOnePackage(id: string): Promise<Packages> {
    return await this.PackagesModel.findById(id).lean();
  }

  // ADMIN USAGE
  async createPlan(plan: CreatePlanDto) {
    return await this.planModel.create(plan);
  }
}
