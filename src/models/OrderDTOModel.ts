export interface OrderDTO {
    data: {
        type: "orders";
        attributes: OrderAttributes;
    }
}

export interface OrderAttributes {
    session: string;
    first_name: string;
    last_name: string;
    birthday: string;
    email: string;
    payment: PaymentTypeCard | PaymentTypeCash;
}

export interface PaymentTypeCard {
    type: "card",
    card: {
        number: string,
        valid_to: string,
        name: string
    }
}

export interface PaymentTypeCash {
    type: "cash",
}
