import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { VerifyTokenGuard } from '../auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from '../auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from '../auth/guards/verify-admin-admin.guard';
import { ConsolidatedReportsRequestDto } from './dto/consolidated-reports.dto';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockReportsService = {
    getMonthlyTrend: jest.fn(),
    getYearlyTrend: jest.fn(),
    getDailyIncome: jest.fn(),
    getDailyOutcome: jest.fn(),
    getTopClients: jest.fn(),
    getClientCount: jest.fn(),
    getWalletCount: jest.fn(),
    getLoanCount: jest.fn(),
    getMonthlyInterests: jest.fn(),
    getLatestTransactions: jest.fn(),
    getTopTransactions: jest.fn(),
    getLatestInvoices: jest.fn(),
    getConsolidatedReports: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    })
      .overrideGuard(VerifyTokenGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(VerifyDisabledUserGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(VerifyAdminAdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getConsolidatedReports', () => {
    it('should return consolidated reports with all data', async () => {
      const mockDto: ConsolidatedReportsRequestDto = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      const mockConsolidatedResponse = {
        financial: {
          monthlyTrend: { reportCode: 'MONTHLY_TREND', reportName: 'Tendencia Mensual' },
          yearlyTrend: { reportCode: 'YEARLY_TREND', reportName: 'Tendencia Anual' },
          dailyIncome: { reportCode: 'DAILY_INCOME', reportName: 'Ingresos Diarios' },
          dailyOutcome: { reportCode: 'DAILY_OUTCOME', reportName: 'Egresos Diarios' },
        },
        clients: {
          topClients: { reportCode: 'TOP_CLIENTS', reportName: 'Clientes Destacados' },
          clientCount: { reportCode: 'CLIENT_COUNT', reportName: 'Cantidad de Clientes' },
          walletCount: { reportCode: 'WALLET_COUNT', reportName: 'Cantidad de Wallets' },
          loanCount: { reportCode: 'LOAN_COUNT', reportName: 'Cantidad de Préstamos' },
        },
        transactions: {
          monthlyInterests: { reportCode: 'MONTHLY_INTERESTS', reportName: 'Intereses Mensuales' },
          latestTransactions: { reportCode: 'LATEST_TRANSACTIONS', reportName: 'Últimas Transacciones' },
          topTransactions: { reportCode: 'TOP_TRANSACTIONS', reportName: 'Top Transacciones' },
        },
        invoices: {
          latestInvoices: { reportCode: 'LATEST_INVOICES', reportName: 'Últimas Facturas' },
        },
        generatedAt: '2024-01-15T10:30:00Z',
      };

      mockReportsService.getConsolidatedReports.mockResolvedValue(mockConsolidatedResponse);

      const result = await controller.getConsolidatedReports(mockDto);

      expect(service.getConsolidatedReports).toHaveBeenCalledWith(mockDto);
      expect(result).toEqual(mockConsolidatedResponse);
      expect(result.financial).toBeDefined();
      expect(result.clients).toBeDefined();
      expect(result.transactions).toBeDefined();
      expect(result.invoices).toBeDefined();
      expect(result.generatedAt).toBeDefined();
    });

    it('should handle requests without date parameters', async () => {
      const mockDto: ConsolidatedReportsRequestDto = {};

      const mockConsolidatedResponse = {
        financial: {
          monthlyTrend: { reportCode: 'MONTHLY_TREND' },
          yearlyTrend: { reportCode: 'YEARLY_TREND' },
          dailyIncome: { reportCode: 'DAILY_INCOME' },
          dailyOutcome: { reportCode: 'DAILY_OUTCOME' },
        },
        clients: {
          topClients: { reportCode: 'TOP_CLIENTS' },
          clientCount: { reportCode: 'CLIENT_COUNT' },
          walletCount: { reportCode: 'WALLET_COUNT' },
          loanCount: { reportCode: 'LOAN_COUNT' },
        },
        transactions: {
          monthlyInterests: { reportCode: 'MONTHLY_INTERESTS' },
          latestTransactions: { reportCode: 'LATEST_TRANSACTIONS' },
          topTransactions: { reportCode: 'TOP_TRANSACTIONS' },
        },
        invoices: {
          latestInvoices: { reportCode: 'LATEST_INVOICES' },
        },
        generatedAt: '2024-01-15T10:30:00Z',
      };

      mockReportsService.getConsolidatedReports.mockResolvedValue(mockConsolidatedResponse);

      const result = await controller.getConsolidatedReports(mockDto);

      expect(service.getConsolidatedReports).toHaveBeenCalledWith(mockDto);
      expect(result).toEqual(mockConsolidatedResponse);
    });

    it('should propagate service errors', async () => {
      const mockDto: ConsolidatedReportsRequestDto = {
        startDate: '2024-01-01',
      };

      const error = new Error('Error al generar reportes consolidados');
      mockReportsService.getConsolidatedReports.mockRejectedValue(error);

      await expect(controller.getConsolidatedReports(mockDto)).rejects.toThrow(error);
      expect(service.getConsolidatedReports).toHaveBeenCalledWith(mockDto);
    });
  });

  describe('individual report endpoints', () => {
    it('should call getMonthlyTrend', async () => {
      const mockDto = { startDate: '2024-01-01', endDate: '2024-12-31' };
      const mockResponse = { reportCode: 'MONTHLY_TREND', data: [] };

      mockReportsService.getMonthlyTrend.mockResolvedValue(mockResponse);

      const result = await controller.getMonthlyTrend(mockDto);

      expect(service.getMonthlyTrend).toHaveBeenCalledWith(mockDto);
      expect(result).toEqual(mockResponse);
    });

    it('should call getDailyIncome', async () => {
      const mockDto = { startDate: '2024-01-01' };
      const mockResponse = { reportCode: 'DAILY_INCOME', data: [] };

      mockReportsService.getDailyIncome.mockResolvedValue(mockResponse);

      const result = await controller.getDailyIncome(mockDto);

      expect(service.getDailyIncome).toHaveBeenCalledWith(mockDto);
      expect(result).toEqual(mockResponse);
    });

    it('should call getLatestTransactions', async () => {
      const mockDto = {};
      const mockResponse = { reportCode: 'LATEST_TRANSACTIONS', data: [] };

      mockReportsService.getLatestTransactions.mockResolvedValue(mockResponse);

      const result = await controller.getLatestTransactions(mockDto);

      expect(service.getLatestTransactions).toHaveBeenCalledWith(mockDto);
      expect(result).toEqual(mockResponse);
    });
  });
});