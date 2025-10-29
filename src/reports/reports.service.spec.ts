import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ReportsService } from './reports.service';
import { Report } from '../entities/report.entity';
import { WalletEvent } from '../entities/wallet-event.entity';
import { Client } from '../entities/client.entity';
import { Wallet } from '../entities/wallet.entity';
import { Loan } from '../entities/loan.entity';
import { Invoice } from '../entities/invoice.entity';
import { ConsolidatedReportsRequestDto } from './dto/consolidated-reports.dto';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockSequelize = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getModelToken(Report),
          useValue: mockRepository,
        },
        {
          provide: getModelToken(WalletEvent),
          useValue: mockRepository,
        },
        {
          provide: getModelToken(Client),
          useValue: mockRepository,
        },
        {
          provide: getModelToken(Wallet),
          useValue: mockRepository,
        },
        {
          provide: getModelToken(Loan),
          useValue: mockRepository,
        },
        {
          provide: getModelToken(Invoice),
          useValue: mockRepository,
        },
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getConsolidatedReports', () => {
    it('should return all consolidated reports successfully', async () => {
      const mockDto: ConsolidatedReportsRequestDto = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      // Mock all individual report methods
      const mockFinancialReports = {
        monthlyTrend: { reportCode: 'MONTHLY_TREND', data: [] },
        yearlyTrend: { reportCode: 'YEARLY_TREND', data: [] },
        dailyIncome: { reportCode: 'DAILY_INCOME', data: [] },
        dailyOutcome: { reportCode: 'DAILY_OUTCOME', data: [] },
      };

      const mockClientReports = {
        topClients: { reportCode: 'TOP_CLIENTS', data: [] },
        clientCount: { reportCode: 'CLIENT_COUNT', data: [] },
        walletCount: { reportCode: 'WALLET_COUNT', data: [] },
        loanCount: { reportCode: 'LOAN_COUNT', data: [] },
      };

      const mockTransactionReports = {
        monthlyInterests: { reportCode: 'MONTHLY_INTERESTS', data: [] },
        latestTransactions: { reportCode: 'LATEST_TRANSACTIONS', data: [] },
        topTransactions: { reportCode: 'TOP_TRANSACTIONS', data: [] },
      };

      const mockInvoiceReports = {
        latestInvoices: { reportCode: 'LATEST_INVOICES', data: [] },
      };

      // Spy on individual methods
      jest.spyOn(service, 'getMonthlyTrend').mockResolvedValue(mockFinancialReports.monthlyTrend as any);
      jest.spyOn(service, 'getYearlyTrend').mockResolvedValue(mockFinancialReports.yearlyTrend as any);
      jest.spyOn(service, 'getDailyIncome').mockResolvedValue(mockFinancialReports.dailyIncome as any);
      jest.spyOn(service, 'getDailyOutcome').mockResolvedValue(mockFinancialReports.dailyOutcome as any);
      
      jest.spyOn(service, 'getTopClients').mockResolvedValue(mockClientReports.topClients as any);
      jest.spyOn(service, 'getClientCount').mockResolvedValue(mockClientReports.clientCount as any);
      jest.spyOn(service, 'getWalletCount').mockResolvedValue(mockClientReports.walletCount as any);
      jest.spyOn(service, 'getLoanCount').mockResolvedValue(mockClientReports.loanCount as any);
      
      jest.spyOn(service, 'getMonthlyInterests').mockResolvedValue(mockTransactionReports.monthlyInterests as any);
      jest.spyOn(service, 'getLatestTransactions').mockResolvedValue(mockTransactionReports.latestTransactions as any);
      jest.spyOn(service, 'getTopTransactions').mockResolvedValue(mockTransactionReports.topTransactions as any);
      
      jest.spyOn(service, 'getLatestInvoices').mockResolvedValue(mockInvoiceReports.latestInvoices as any);

      const result = await service.getConsolidatedReports(mockDto);

      // Verify the structure
      expect(result).toBeDefined();
      expect(result.financial).toEqual(mockFinancialReports);
      expect(result.clients).toEqual(mockClientReports);
      expect(result.transactions).toEqual(mockTransactionReports);
      expect(result.invoices).toEqual(mockInvoiceReports);
      expect(result.generatedAt).toBeDefined();
      expect(typeof result.generatedAt).toBe('string');

      // Verify all methods were called with correct parameters
      expect(service.getMonthlyTrend).toHaveBeenCalledWith({ startDate: '2024-01-01', endDate: '2024-12-31' });
      expect(service.getYearlyTrend).toHaveBeenCalledWith({ startDate: '2024-01-01', endDate: '2024-12-31' });
      expect(service.getDailyIncome).toHaveBeenCalledWith({ startDate: '2024-01-01' });
      expect(service.getDailyOutcome).toHaveBeenCalledWith({ startDate: '2024-01-01' });
      
      expect(service.getTopClients).toHaveBeenCalledWith({ startDate: '2024-01-01', endDate: '2024-12-31' });
      expect(service.getClientCount).toHaveBeenCalledWith({});
      expect(service.getWalletCount).toHaveBeenCalledWith({});
      expect(service.getLoanCount).toHaveBeenCalledWith({});
      
      expect(service.getMonthlyInterests).toHaveBeenCalledWith({ startDate: '2024-01-01' });
      expect(service.getLatestTransactions).toHaveBeenCalledWith({});
      expect(service.getTopTransactions).toHaveBeenCalledWith({});
      
      expect(service.getLatestInvoices).toHaveBeenCalledWith({});
    });

    it('should handle empty request DTO', async () => {
      const mockDto: ConsolidatedReportsRequestDto = {};

      // Mock all methods to return empty results
      jest.spyOn(service, 'getMonthlyTrend').mockResolvedValue({ reportCode: 'MONTHLY_TREND' } as any);
      jest.spyOn(service, 'getYearlyTrend').mockResolvedValue({ reportCode: 'YEARLY_TREND' } as any);
      jest.spyOn(service, 'getDailyIncome').mockResolvedValue({ reportCode: 'DAILY_INCOME' } as any);
      jest.spyOn(service, 'getDailyOutcome').mockResolvedValue({ reportCode: 'DAILY_OUTCOME' } as any);
      jest.spyOn(service, 'getTopClients').mockResolvedValue({ reportCode: 'TOP_CLIENTS' } as any);
      jest.spyOn(service, 'getClientCount').mockResolvedValue({ reportCode: 'CLIENT_COUNT' } as any);
      jest.spyOn(service, 'getWalletCount').mockResolvedValue({ reportCode: 'WALLET_COUNT' } as any);
      jest.spyOn(service, 'getLoanCount').mockResolvedValue({ reportCode: 'LOAN_COUNT' } as any);
      jest.spyOn(service, 'getMonthlyInterests').mockResolvedValue({ reportCode: 'MONTHLY_INTERESTS' } as any);
      jest.spyOn(service, 'getLatestTransactions').mockResolvedValue({ reportCode: 'LATEST_TRANSACTIONS' } as any);
      jest.spyOn(service, 'getTopTransactions').mockResolvedValue({ reportCode: 'TOP_TRANSACTIONS' } as any);
      jest.spyOn(service, 'getLatestInvoices').mockResolvedValue({ reportCode: 'LATEST_INVOICES' } as any);

      const result = await service.getConsolidatedReports(mockDto);

      expect(result).toBeDefined();
      expect(result.generatedAt).toBeDefined();

      // Verify methods were called with correct undefined parameters
      expect(service.getMonthlyTrend).toHaveBeenCalledWith({ startDate: undefined, endDate: undefined });
      expect(service.getDailyIncome).toHaveBeenCalledWith({ startDate: undefined });
    });

    it('should handle errors from individual report methods', async () => {
      const mockDto: ConsolidatedReportsRequestDto = {
        startDate: '2024-01-01',
      };

      // Mock one method to throw an error
      jest.spyOn(service, 'getMonthlyTrend').mockRejectedValue(new Error('Database connection failed'));

      await expect(service.getConsolidatedReports(mockDto)).rejects.toThrow(
        'Error al generar reportes consolidados: Database connection failed'
      );
    });

    it('should generate valid ISO timestamp', async () => {
      const mockDto: ConsolidatedReportsRequestDto = {};
      
      // Mock all methods
      const mockMethods = [
        'getMonthlyTrend', 'getYearlyTrend', 'getDailyIncome', 'getDailyOutcome',
        'getTopClients', 'getClientCount', 'getWalletCount', 'getLoanCount',
        'getMonthlyInterests', 'getLatestTransactions', 'getTopTransactions', 'getLatestInvoices'
      ];

      mockMethods.forEach(method => {
        jest.spyOn(service, method as any).mockResolvedValue({ reportCode: method.toUpperCase() } as any);
      });

      const beforeTime = new Date();
      const result = await service.getConsolidatedReports(mockDto);
      const afterTime = new Date();

      const generatedTime = new Date(result.generatedAt);
      expect(generatedTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(generatedTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
      expect(result.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
});