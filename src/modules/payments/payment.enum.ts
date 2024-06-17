export enum ProductType {
  PLAN = 'plan',
  PACKAGE = 'package',
  PLAN_EXCHANGE = 'plan_exchange',
}

export enum PaymentMethod {
  PIX = 'pix',
  CREDIT_CARD = 'credit-card',
  TICKET = 'ticket',
}

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
}

export enum PaymentGateway {
  Pagarme = 'pagarme',
  Starkbank = 'starkbank',
  Boleto = 'boleto',
  Manual = 'manual',
}
