import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existing = await this.userModel.findOne({ email });
    if (existing) throw new ConflictException('Email already in use');

    try {
      const hashed = await bcrypt.hash(password, 10);
      const created = new this.userModel({ email, password: hashed });
      const saved = await created.save();
      // remove password before returning
      const obj = saved.toObject();
      delete (obj as { password?: string }).password;
      return obj;
    } catch (err) {
      throw new InternalServerErrorException('Could not create user');
    }
  }
}