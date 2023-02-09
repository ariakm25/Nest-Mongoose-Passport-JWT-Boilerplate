import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Connection, Document, FilterQuery, Model } from 'mongoose';

interface ExistsValidationArguments<D> extends ValidationArguments {
  constraints: [
    Model<Document<D>>,
    (
      | ((validationArguments: ValidationArguments) => FilterQuery<Document<D>>)
      | keyof D
    ),
  ];
}

abstract class ExistsValidator implements ValidatorConstraintInterface {
  protected constructor(protected readonly connection: Connection) {}

  public async validate<E>(value: string, args: ExistsValidationArguments<E>) {
    const [Model, findCondition = args.property] = args.constraints;
    return (
      (await this.connection.model(Model.name).count(
        typeof findCondition === 'function'
          ? findCondition(args)
          : {
              [findCondition || args.property]: value,
            },
      )) > 0
    );
  }

  public defaultMessage(args: ValidationArguments) {
    return `'${args.property}' ${args.value} doesn't exist`;
  }
}

@ValidatorConstraint({ name: 'Exists', async: true })
@Injectable()
export class Exists extends ExistsValidator {
  constructor(@InjectConnection() protected readonly connection: Connection) {
    super(connection);
  }
}
