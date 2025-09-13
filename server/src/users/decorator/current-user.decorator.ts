import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWT_PAYLOAD } from 'src/utils/type'; // Adjust path as needed
import { CURRENT_USER_KEY } from 'src/utils/constants'; // Adjust path as needed


//Currente user decorator
export const CurrentUser= createParamDecorator(
    (data: unknown, context: ExecutionContext): JWT_PAYLOAD | null => {
        const request = context.switchToHttp().getRequest()
        const payload: JWT_PAYLOAD = request[CURRENT_USER_KEY] || null
        return payload; 
    }
)
