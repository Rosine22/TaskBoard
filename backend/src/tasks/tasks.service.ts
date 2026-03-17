import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepo: Repository<Task>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.tasksRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepo.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task with id "${id}" not found`);
    return task;
  }

  create(dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepo.create(dto);
    return this.tasksRepo.save(task);
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.findOne(id);
    task.status = status;
    return this.tasksRepo.save(task);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    await this.findOne(id); // throws 404 if not found
    await this.tasksRepo.delete(id);
    return { deleted: true };
  }
}
