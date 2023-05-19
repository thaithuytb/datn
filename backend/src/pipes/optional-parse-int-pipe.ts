import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class OptionalParseIntPipe
  implements PipeTransform<string | undefined, number>
{
  transform(
    value: string | undefined,
    metadata: ArgumentMetadata,
  ): number | undefined {
    if (value === undefined) {
      return undefined;
    }
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new BadRequestException(`${metadata.data} must be numeric`);
    }
    return parsedValue;
  }
}
