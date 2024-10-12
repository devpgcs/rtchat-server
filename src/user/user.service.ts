import * as bcrypt from 'bcrypt';

import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionFields } from 'mongoose';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Creates a new user.
   *
   * @param {CreateUserDto} createUserDto The data transfer object for creating a user.
   * @returns {Promise<User>} The created user.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);

    // Anything different to characters a-z, A-Z, 0-9, and _ will be removed
    newUser.username = newUser.username
      .replaceAll(/[^a-zA-Z0-9_]/g, '')
      .toLowerCase();

    // For security reasons, we hash the password before storing it
    newUser.password = await bcrypt.hash(newUser.password, 10);

    const existingUser = await this.userModel
      .findOne({
        $or: [
          { username: newUser.username },
          { phoneNumber: newUser.phoneNumber },
        ],
      })
      .select('id')
      .exec();

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const createdUser = await newUser.save();

    return createdUser.toJSON();
  }

  /**
   * Finds a user by a filter query.
   *
   * @param {FilterQuery<User>} filterQuery The filter query to find the user.
   * @param {ProjectionFields<User>} projectionFields The fields to project.
   * @returns {Promise<UserDocument>} The found user.
   */
  async findOne(
    filterQuery: FilterQuery<User>,
    projectionFields?: ProjectionFields<User>,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findOne(filterQuery, projectionFields)
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Finds many users by a filter query.
   *
   * @param {FilterQuery<User>} filterQuery The filter query to find the users.
   * @param {ProjectionFields<User>} projectionFields The fields to project.
   * @returns {Promise<UserDocument[]>} The found users.
   */
  async findMany(
    filterQuery: FilterQuery<User>,
    projectionFields?: ProjectionFields<User>,
  ): Promise<UserDocument[]> {
    return this.userModel.find(filterQuery, projectionFields).exec();
  }

  /**
   * Compares a request password with a stored password.
   *
   * @param {string} requestPassword The request password.
   * @param {string} storedPassword The stored password.
   * @returns {Promise<boolean>} `true` if the passwords match, `false` otherwise.
   */
  async comparePasswords(
    requestPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(requestPassword, storedPassword);
  }
}
