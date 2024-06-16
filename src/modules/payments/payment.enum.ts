export enum PaymentStatus {
    Paid = 'paid',
    Pending = 'pending',
    Refused = 'refused',
}

export enum PaymentGateway {
    Pagarme = 'pagarme',
    Starkbank = 'starkbank',
    Boleto = 'boleto',
    Manual = 'manual'
}