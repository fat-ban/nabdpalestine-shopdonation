import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotService } from './chatbot.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { JWT_PAYLOAD } from '../utils/type';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../utils/enums';

describe('ChatbotService', () => {
  let service: ChatbotService;
  let ordersService: OrdersService;
  let usersService: UsersService;

  const mockOrdersService = {
    getUserOrders: jest.fn(),
  };

  const mockUsersService = {
    getCurrentUser: jest.fn(),
  };

  const mockUser: JWT_PAYLOAD = {
    id: '1',
    email: 'test@example.com',
    role: 'user',
  };

  const mockCurrentUser = {
    id: '1',
    username: 'Test User',
    email: 'test@example.com',
    role: 'user',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatbotService,
        { provide: OrdersService, useValue: mockOrdersService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<ChatbotService>(ChatbotService);
    ordersService = module.get<OrdersService>(OrdersService);
    usersService = module.get<UsersService>(UsersService);

    mockUsersService.getCurrentUser.mockResolvedValue(mockCurrentUser);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getResponse', () => {
    it('should return a personalized greeting', async () => {
      const message = 'مرحباً';
      const expectedResponse = `مرحباً ${mockCurrentUser.username}! كيف يمكنني مساعدتك اليوم؟`;
      const response = await service.getResponse(message, mockUser);
      expect(response).toBe(expectedResponse);
    });

    it('should return order information if the user has orders', async () => {
      const message = 'طلب';
      const mockOrders: Partial<Order>[] = [
        { id: 1, status: OrderStatus.PENDING },
        { id: 2, status: OrderStatus.COMPLETED },
      ];
      mockOrdersService.getUserOrders.mockResolvedValue({ data: mockOrders, total: 2 });

      const response = await service.getResponse(message, mockUser);

      expect(ordersService.getUserOrders).toHaveBeenCalledWith(mockUser.id);
      expect(response).toContain('لدينا 2 طلبات لك:');
      expect(response).toContain('- طلب رقم 1 بحالة pending');
      expect(response).toContain('- طلب رقم 2 بحالة completed');
    });

    it('should return a message if the user has no orders', async () => {
      const message = 'طلب';
      mockOrdersService.getUserOrders.mockResolvedValue({ data: [], total: 0 });

      const response = await service.getResponse(message, mockUser);

      expect(ordersService.getUserOrders).toHaveBeenCalledWith(mockUser.id);
      expect(response).toBe('لم أجد أي طلبات لك. هل تود القيام بطلب جديد؟');
    });

    it('should return payment methods', async () => {
      const message = 'دفع';
      const expectedResponse = `طرق الدفع المتاحة:\n• بطاقات الائتمان\n• باي بال\n• العملات المشفرة عبر البلوكشين`;
      const response = await service.getResponse(message, mockUser);
      expect(response).toBe(expectedResponse);
    });

    it('should return donation information', async () => {
      const message = 'تبرع';
      const expectedResponse = `يمكنك التبرع عبر:\n• صفحة التبرعات المباشرة\n• إضافة تبرع لسلة التسوق`;
      const response = await service.getResponse(message, mockUser);
      expect(response).toBe(expectedResponse);
    });

    it('should return a default message for an unknown question', async () => {
      const message = 'any other question';
      const expectedResponse = `عذراً، لم أفهم سؤالك تماماً. هل ترغب في:\n- متابعة طلب\n- معرفة طرق الدفع\n- التبرع للمشروع`;
      const response = await service.getResponse(message, mockUser);
      expect(response).toBe(expectedResponse);
    });
  });
});
