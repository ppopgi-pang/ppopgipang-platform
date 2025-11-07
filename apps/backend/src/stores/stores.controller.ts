import { Body, Controller, Post } from '@nestjs/common';
import { StoresService } from './stores.service';
import { AdminStore } from '@ppopgipang/types';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(
    @Body() dto: AdminStore.createDto
  ) {
    return this.storesService.create(dto);
  }
}
