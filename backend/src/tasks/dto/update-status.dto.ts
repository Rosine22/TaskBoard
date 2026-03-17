import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class UpdateStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
