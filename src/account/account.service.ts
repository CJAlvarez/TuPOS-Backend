import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account)
    private accountModel: typeof Account,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    // Solo toma los campos válidos para el modelo
    return this.accountModel.create({ ...createAccountDto } as any);
  }

  async findAll(): Promise<Account[]> {
    return this.accountModel.findAll();
  }

  // Agrega más métodos según la lógica original
}
