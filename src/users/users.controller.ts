import { Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBasicAuth } from '@nestjs/swagger';

@ApiBasicAuth()
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Post('/all')
    getAllUsers() {
        return this.userService.getAll()
    }

    @Delete('/:id')
    removeUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id)
    }
}
