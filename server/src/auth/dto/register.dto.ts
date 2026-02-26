import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class RegisterDto {

  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsEmail()
  userEmail: string

  @MinLength(10)
  password: string
}
