import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { JwtPayload } from 'src/common/types';
import { UpdateUserDto } from 'src/common/dtos/updateUser.dto';
import { Serialize } from 'src/interceptors/serielize.interceptor';
import { UserProfileDto } from 'src/common/dtos/userProfile.dto';
import { UpdatePasswordDto } from 'src/common/dtos/updatePassword.dto';
import { Response } from 'express';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get('/all')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles('admin')
    @Serialize(UserProfileDto)
    getAllUsers() {
        return this.userService.getAll()
    }

    @Get('/psychologists')
    @Serialize(UserProfileDto)
    getPsychologists() {
        return this.userService.getPsychologists()
    }

    @Patch('/change-password/:id')
    @UseGuards(AuthGuard)
    updatePassword(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload, @Body() body: UpdatePasswordDto) {
        return this.userService.changePassword(id, user.id, body.oldPassword, body.newPassword)
    }

    @Patch('/admin-verify/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles('admin')
    verifyuser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.verifyUser(id)
    }

    @Patch('/:id') // Which fields can update, it has to be shown for the user`s role in Frontend
    @UseGuards(AuthGuard)
    @Serialize(UserProfileDto)
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto, @CurrentUser() user: JwtPayload) {
        return this.userService.update(id, body, user.id)
    }

    @Delete('/admin/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles('admin')
    deletebyadmin(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteByAdmin(id)
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    removeUser(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload, @Res({ passthrough: true }) res: Response) {
        res.clearCookie('refreshToken', { path: '/auth' });
        return this.userService.delete(id, user.id)
    }

    @Get('/profile')
    @UseGuards(AuthGuard)
    @Serialize(UserProfileDto)
    getProfile(@CurrentUser() user: JwtPayload) {
        return this.userService.findById(user.id)
    }
}
