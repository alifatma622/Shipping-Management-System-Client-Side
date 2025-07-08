export enum OrderStatus {
        Pending = 1,
        AcceptedByDeliveryCompany=2,
        RejectedByDeliveryCompany=3,
        Delivered=4,
        DeliveredToDeliveryMan=5,
        CanNotBeReached=6,
        Postponed=7,
        PartiallyDelivered=8,
        CanceledByCustomer=9,
        RejectWithPayment=10,
        RejectWithoutPayment=11,
        RejectWithPartiallyPaid=12

}
