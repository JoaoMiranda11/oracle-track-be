import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { ApiKeyGuard } from 'src/guards/apiKey/apikey.guard';

@Controller('webhook')
export class WebhooksController {
  constructor(private readonly webhookservice: WebhooksService) {}

  @UseGuards(ApiKeyGuard)
  @Post('approve')
  async paymentApproved(
    @Body() metadata: any,
    @Query('paymentId') paymentId: string,
  ) {
    this.webhookservice.approvePayment(paymentId, metadata);
  }
}
