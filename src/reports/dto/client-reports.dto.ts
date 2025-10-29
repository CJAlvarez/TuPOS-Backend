import { ApiProperty } from '@nestjs/swagger';
import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';

// Clientes destacados DTO
export class TopClientsRequestDto extends BaseReportRequestDto {}

export class TopClientsResponseDto extends BaseReportResponseDto {
  @ApiProperty({ 
    description: 'Clientes con más movimientos',
    type: 'object',
    properties: {
      clients: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            clientId: { type: 'number' },
            clientName: { type: 'string' },
            movementCount: { type: 'number' },
            totalAmount: { type: 'number' }
          }
        }
      }
    }
  })
  declare data: {
    clients: Array<{
      clientId: number;
      clientName: string;
      movementCount: number;
      totalAmount: number;
    }>;
  };
}

// Conteos DTO
export class ClientCountRequestDto extends BaseReportRequestDto {}

export class ClientCountResponseDto extends BaseReportResponseDto {
  @ApiProperty({ 
    description: 'Cantidad total de clientes',
    type: 'object',
    properties: {
      totalClients: { type: 'number' },
      activeClients: { type: 'number' },
      inactiveClients: { type: 'number' }
    }
  })
  declare data: {
    totalClients: number;
    activeClients: number;
    inactiveClients: number;
  };
}

export class WalletCountRequestDto extends BaseReportRequestDto {}

export class WalletCountResponseDto extends BaseReportResponseDto {
  @ApiProperty({ 
    description: 'Cantidad total de wallets',
    type: 'object',
    properties: {
      totalWallets: { type: 'number' },
      activeWallets: { type: 'number' },
      totalBalance: { type: 'number' }
    }
  })
  declare data: {
    totalWallets: number;
    activeWallets: number;
    totalBalance: number;
  };
}

export class LoanCountRequestDto extends BaseReportRequestDto {}

export class LoanCountResponseDto extends BaseReportResponseDto {
  @ApiProperty({ 
    description: 'Cantidad total de préstamos',
    type: 'object',
    properties: {
      totalLoans: { type: 'number' },
      activeLoans: { type: 'number' },
      totalAmount: { type: 'number' },
      pendingAmount: { type: 'number' }
    }
  })
  declare data: {
    totalLoans: number;
    activeLoans: number;
    totalAmount: number;
    pendingAmount: number;
  };
}