import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InteractionType, Language } from '../../utils/enums';

@Entity({ name: 'ai_interactions' })
export class AIInteraction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  input_text: string;

  @Column('text')
  output_text: string;

  @ManyToOne(() => User, user => user.aiInteractions, { nullable: true })
  user: User;

  @Column('enum', { enum: Language, default: Language.AR } )
  language: Language; // 'ar' or 'en'

  @Column('enum', { enum: InteractionType, default: InteractionType.CHAT })
  interaction_type: string; // e.g., 'chat', 'moderation', 'recommendation'

  @CreateDateColumn()
  created_at: Date;
}