import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  Connection,
  Document,
  FilterQuery,
  isValidObjectId,
  Model,
  Types,
} from 'mongoose';

interface UniqueValidationArguments<D> extends ValidationArguments {
  constraints: [
    Model<Document<D>>,
    (
      | ((validationArguments: ValidationArguments) => FilterQuery<Document<D>>)
      | keyof D
    ),
    [string, string],
  ];
}

abstract class UniqueValidator implements ValidatorConstraintInterface {
  protected constructor(protected readonly connection: Connection) {}

  public async validate<E>(value: string, args: UniqueValidationArguments<E>) {
    const [Model, findCondition = args.property, except] = args.constraints;

    const filterQuery =
      typeof findCondition === 'function'
        ? findCondition(args)
        : {
            [findCondition || args.property]: value,
          };

    if (typeof filterQuery !== 'function' && except) {
      const [exceptField, exceptValue] = except;

      let relatedValue = (args.object as any)[exceptValue];

      if (exceptField === '_id') {
        if (!isValidObjectId(relatedValue)) {
          return false;
        }
        relatedValue = new Types.ObjectId(relatedValue);
      }

      if (exceptField && exceptValue) {
        filterQuery[exceptField] = { $ne: relatedValue };
      }
    }

    return (await this.connection.model(Model.name).count(filterQuery)) <= 0;
  }

  public defaultMessage(args: ValidationArguments) {
    return `${args.property} already exist`;
  }
}

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class Unique extends UniqueValidator {
  constructor(@InjectConnection() protected readonly connection: Connection) {
    super(connection);
  }
}
