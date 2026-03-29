import { Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBasicAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiBasicAuth()
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Post('/all')
    getAllUsers() {
        return this.userService.getAll()
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    removeUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id)
    }
}
