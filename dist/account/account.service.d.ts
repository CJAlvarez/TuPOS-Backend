import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
export declare class AccountService {
    private accountModel;
    constructor(accountModel: typeof Account);
    create(createAccountDto: CreateAccountDto): Promise<Account>;
    findAll(): Promise<Account[]>;
}
