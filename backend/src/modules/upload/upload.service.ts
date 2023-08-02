import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';

@Injectable()
export class UploadService {
  constructor(private readonly authRepository: AuthRepository) {}
}
