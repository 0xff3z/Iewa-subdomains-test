import {Body, Controller, Get, HttpCode, Post, Res, UseGuards, UsePipes, ValidationPipe} from "@nestjs/common";
import {ApiBody, ApiOkResponse, ApiOperation, ApiProperty, ApiResponse, ApiTags} from "@nestjs/swagger";
import { RegisterDto } from "src/DTO/register.dto";
import {AuthService} from "../../Service/Auth/auth.service";
import {LoginDto} from "../../DTO/Login.dto";
import {LoginResponseDto} from "../../DTO/Response/LoginResponse.dto";
import {AuthGuard} from "@nestjs/passport";
import {CurrentAuthClientUser} from "../../Config/CurrentAuthClientUser.decorator";

@Controller('auth/business-owner')
@UsePipes(ValidationPipe)
@ApiTags('Business Owner Authentication')
export class BusinessOwnerAuthController {
    constructor(
        private readonly AuthService: AuthService,
    ) {
    }

    @Post('register')
    @ApiOperation({summary: 'Register a new business owner', description: 'Register a new business owner'})
    @ApiResponse({status: 201, description: 'Business owner registered successfully'})
    @ApiOkResponse({description: 'Business owner registered successfully', isArray: false, status: 201,schema: {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    description: 'JWT token' +
                        'Bearer token',
                    example: 'Bearer token'
                },
                message: {
                    type: 'string',
                    description: 'Registration successful',
                    example: 'Registration successful'
                }

            }
        }
        }
    )
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @ApiProperty({type: RegisterDto})
    @HttpCode(201)
    @UsePipes(ValidationPipe)
    async register(@Body() registerDto: RegisterDto,@Res() res) {
        return this.AuthService.registerBusinessOwner(registerDto, res);
    }

    @Post('login')
    @ApiOperation({summary: 'Login a business owner', description: 'Login a business owner'})
    @ApiOkResponse({description: 'Business owner logged in successfully', isArray: false, status: 200,schema: {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    description: 'JWT token' +
                        'Bearer token',
                    example: 'Bearer token'
                },
                message: {
                    type: 'string',
                    description: 'Login successful',
                    example: 'Login successful'
                }

            }
        }
    })
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @ApiProperty({type: LoginDto})
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async login(@Body() loginDto: LoginDto,@Res() res) {
        return this.AuthService.loginBusinessOwner(loginDto, res);
    }

    @Post('logout')
    @ApiOperation({summary: 'Logout a business owner', description: 'Logout a business owner'})
    @ApiOkResponse({description: 'Business owner logged out successfully', isArray: false, status: 200,schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Logout successful',
                    example: 'Logout successful'
                }

            }
        }
    })
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @HttpCode(200)
    async logout(@Res() res) {
        return this.AuthService.logoutBusinessOwner(res);
    }

    @Post('refresh-token')
    @ApiOperation({summary: 'Refresh token', description: 'Refresh token'})
    @ApiOkResponse({description: 'Token refreshed successfully', isArray: false, status: 200,schema: {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    description: 'JWT token' +
                        'Bearer token',
                    example: 'Bearer token'
                },
                message: {
                    type: 'string',
                    description: 'Token refreshed successfully',
                    example: 'Token refreshed successfully'
                }

            }
        }
    })
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @HttpCode(200)
    async refreshToken(@Res() res) {
        return this.AuthService.refreshToken(res);
    }
    @Get("check-auth")
    @ApiOperation({summary: 'Check authentication', description: 'Check authentication'})
    @ApiOkResponse({description: 'Authentication successful', isArray: false, status: 200,schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Authentication successful',
                    example: 'Authentication successful'
                }

            }
        }
    })
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @HttpCode(200)
    async checkAuth(
        @Res() res,
        @CurrentAuthClientUser() user
    ) {
        console.log(user);
        return this.AuthService.checkAuth(res, user);
    }



}

