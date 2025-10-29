import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    create(createAccountDto: CreateAccountDto): Promise<import("./account.entity").Account>;
    findAll(): Promise<import("./account.entity").Account[]>;
}
