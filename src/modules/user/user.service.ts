import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, isValidObjectId } from 'mongoose';
import { TokenService } from '../token/token.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: PaginateModel<UserDocument>,
    private readonly tokenService: TokenService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    await this.isEmailUnique(user.email);
    return await user.save();
  }

  async findAll(queryUserDto: QueryUserDto): Promise<PaginateResult<User>> {
    const query: any = {};

    if (queryUserDto.name) {
      query.name = { $regex: '.*' + queryUserDto.name + '.*', $options: 'i' };
    }

    if (queryUserDto.email) {
      query.email = { $regex: '.*' + queryUserDto.email + '.*', $options: 'i' };
    }

    if (queryUserDto.role) {
      query.role = queryUserDto.role;
    }

    const options = {
      page: queryUserDto.page || 1,
      limit: queryUserDto.limit <= 24 ? queryUserDto.limit : 24,
      populate: 'role',
    };

    return await this.userModel.paginate(query, options);
  }

  async findOne(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(['invalid id']);
    }

    const data = await this.userModel.findOne({ _id: id }).populate('role');

    if (!data) {
      throw new NotFoundException(['user not found']);
    }
    return data;
  }

  async findOneBy(key: string, value: string): Promise<User> {
    return await this.userModel.findOne({ [key]: value }).populate('role');
  }

  async updateById(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto)
      .populate('role');
  }

  async updatePassword(userId: string, password: string): Promise<User> {
    if (!isValidObjectId(userId)) {
      throw new NotFoundException(['invalid id']);
    }
    this.tokenService.deleteAllUserTokens(userId);
    const user = await this.userModel.findById(userId).populate('role');
    user.password = password;
    return await user.save();
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(['invalid id']);
    }
    return await this.userModel.findByIdAndRemove(id);
  }

  private async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email, verified: true });
    if (user) {
      throw new BadRequestException(['email already taken']);
    }

    return true;
  }
}
