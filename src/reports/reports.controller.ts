import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { VerifyTokenGuard } from '../auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from '../auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from '../auth/guards/verify-admin-admin.guard';
import {
  MonthlyTrendRequestDto,
  MonthlyTrendResponseDto,
  YearlyTrendRequestDto,
  YearlyTrendResponseDto,
  DailyIncomeRequestDto,
  DailyIncomeResponseDto,
  DailyOutcomeRequestDto,
  DailyOutcomeResponseDto,
} from './dto/financial-reports.dto';
import {
  TopClientsRequestDto,
  TopClientsResponseDto,
  ClientCountRequestDto,
  ClientCountResponseDto,
  WalletCountRequestDto,
  WalletCountResponseDto,
  LoanCountRequestDto,
  LoanCountResponseDto,
} from './dto/client-reports.dto';
import {
  MonthlyInterestsRequestDto,
  MonthlyInterestsResponseDto,
  LatestTransactionsRequestDto,
  LatestTransactionsResponseDto,
  TopTransactionsRequestDto,
  TopTransactionsResponseDto,
} from './dto/transaction-reports.dto';
import {
  LatestInvoicesRequestDto,
  LatestInvoicesResponseDto,
} from './dto/invoice-reports.dto';
import {
  ConsolidatedReportsRequestDto,
  ConsolidatedReportsResponseDto,
} from './dto/consolidated-reports.dto';

@ApiTags('reports')
@Controller('reports')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
}
