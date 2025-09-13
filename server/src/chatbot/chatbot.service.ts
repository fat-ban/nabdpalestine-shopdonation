import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { JWT_PAYLOAD } from '../utils/type';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  async getResponse(userMessage: string, user: JWT_PAYLOAD): Promise<string> {
    const msg = userMessage.toLowerCase();
    const currentUser = await this.usersService.getCurrentUser(user.id);

    if (msg.includes('مرحباً')) {
      return `مرحباً ${currentUser.username}! كيف يمكنني مساعدتك اليوم؟`;
    }

    if (msg.includes('طلب')) {
      const { data: orders } = await this.ordersService.getUserOrders(user.id);
      if (orders.length === 0) {
        return 'لم أجد أي طلبات لك. هل تود القيام بطلب جديد؟';
      }
      const orderList = orders
        .map((order) => `- طلب رقم ${order.id} بحالة ${order.status}`)
        .join('\n');
      return `لدينا ${orders.length} طلبات لك:\n${orderList}`;
    }

    if (msg.includes('دفع')) {
      return `طرق الدفع المتاحة:\n• بطاقات الائتمان\n• باي بال\n• العملات المشفرة عبر البلوكشين`;
    }

    if (msg.includes('تبرع')) {
      return `يمكنك التبرع عبر:\n• صفحة التبرعات المباشرة\n• إضافة تبرع لسلة التسوق`;
    }

    return `عذراً، لم أفهم سؤالك تماماً. هل ترغب في:\n- متابعة طلب\n- معرفة طرق الدفع\n- التبرع للمشروع`;
  }
}
