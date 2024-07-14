import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { DatabaseModule } from 'src/database/database.module';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class TodoService {
  constructor(private readonly databaseService:DatabaseService){}

  async create(createTodoDto: CreateTodoDto, email:string) {
    try{
      const user = await this.databaseService.user.findUnique({where:{email}});
      if(!user){
        throw new Error('User not found')
      }
      let data: Prisma.TodoCreateInput={
        description:createTodoDto.description,
        task:createTodoDto.task,
        status :'ACTIVE',
        user: {
          connect: {email: user.email}
        },
      }
      
    return await this.databaseService.todo.create({data});
    }
    catch(err){
      return err
    }
  }

  async findAll(userEmail:string) {
    return this.databaseService.todo.findMany({
      where:{
        userEmail:userEmail
      }
    });
  }

  findOne(id: number) {
    return this.databaseService.todo.findFirst({
      where:{
        id:id
      }
    })
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    return this.databaseService.todo.update({
      where:{
        id:id
      },
      data:updateTodoDto
    })
  }

  remove(id: number) {
    return this.databaseService.todo.delete({
      where:{
        id:id
      }
    })
  }
}
