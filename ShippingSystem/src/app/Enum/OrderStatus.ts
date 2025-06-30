export enum OrderStatus {
    Pending = 1,
    AcceptedByDeliveryCompany,
    RejectedByDeliveryCompany,
    Delivered,
    DeliveredToDeliveryMan,
    CanNotBeReached,
    Postponed,
    PartiallyDelivered,
    CanceledByCustomer,
    RejectWithPayment,
    RejectWithoutPayment,
    RejectWithPartiallyPaid
    
}