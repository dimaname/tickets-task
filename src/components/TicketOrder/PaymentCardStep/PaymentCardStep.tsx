import *  as React from 'react';
import './PaymentCardStep.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';
import {PaymentCard} from "../TicketOrder";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

type Props = {
    toPrevStep: () => void,
    requestWillBeRejected: boolean,
    changeRequestWillBeRejected: (value: boolean) => void,
    onSubmit: (paymentCard: PaymentCard) => void,
}

type State = {
    cardNumber: string;
    cardDate: string;
    cardCvc: string;
}

export class PaymentCardStep extends React.Component<Props, State> {
    state: State = {
        cardNumber: '',
        cardDate: '',
        cardCvc: '',
    };

    render() {
        const {cardNumber, cardDate, cardCvc} = this.state;
        const cardNumberIsError = !!cardNumber && cardNumber.length < 16;
        const cardDateIsError = !!cardDate && cardDate.length < 4;
        const cardCvcIsError = !!cardCvc && cardCvc.length < 3;
        const submitButtonDisabled = !cardNumber || !cardDate || !cardCvc || cardNumberIsError || cardDateIsError || cardCvcIsError;
        return <div className="payment-card-step">
            <div className="payment-card-step-title">Платежная карта</div>
            <div className="payment-card">
                <TextField
                    autoFocus
                    required
                    error={cardNumberIsError}
                    label="Номер карты"
                    margin="none"
                    type="tel"
                    placeholder="Номер карты"
                    onChange={this.onChangeStateField('cardNumber')}
                    InputProps={{
                        inputComponent: NumberFormatCardNumber as any,
                    }}
                    classes={{root: 'payment-card-field'}}

                />
                <div className="payment-card-second-row">
                    <TextField
                        required
                        error={cardDateIsError}
                        label="Срок действия"
                        margin="none"
                        type="tel"
                        placeholder="MM / YY"
                        onChange={this.onChangeStateField('cardDate')}
                        InputProps={{
                            inputComponent: NumberFormatCardDate as any,
                        }}
                        classes={{root: 'payment-card-field payment-card-field-date'}}
                    />

                    <TextField
                        required
                        error={cardCvcIsError}
                        label="CVC"
                        margin="none"
                        type="tel"
                        placeholder="CVC"
                        onChange={this.onChangeStateField('cardCvc')}
                        InputProps={{
                            inputComponent: NumberFormatCardCvc as any,
                        }}
                        classes={{root: 'payment-card-field payment-card-field-cvc'}}
                    />
                </div>
            </div>
            <div className="buttons-container">
                <Button variant="outlined" onClick={this.props.toPrevStep}>
                    Назад
                </Button>
                <Button variant="contained" color="primary"
                        disabled={submitButtonDisabled}
                        onClick={this.onSubmit}>
                    Заказать билет
                </Button>
                <FormControlLabel
                    control={
                        <Switch
                            checked={this.props.requestWillBeRejected}
                            onChange={this.changeRequestWillBeRejected}
                            color="primary"
                        />
                    }
                    label="reject request"
                />
            </div>
        </div>
    }

    private changeRequestWillBeRejected = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.changeRequestWillBeRejected(event.target.checked);
    };

    private onSubmit = () => {
        const {cardNumber, cardDate, cardCvc} = this.state;
        this.props.onSubmit({cardNumber, cardDate, cardCvc})
    };

    private onChangeStateField = (propName: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [propName]: event.target.value
        }as any);
    };

}

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { value: string } }) => void;
}

function NumberFormatCardNumber(props: NumberFormatCustomProps) {
    const {inputRef, onChange, ...other} = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => onChange({target: {value: values.value}})}
            format="#### #### #### ####"
            thousandSeparator
            isNumericString
        />
    );
}

function NumberFormatCardDate(props: NumberFormatCustomProps) {
    const {inputRef, onChange, ...other} = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => onChange({target: {value: values.value}})}
            format="##/##"
            mask={['M', 'M', 'Y', 'Y']}
            isNumericString
        />
    );
}

function NumberFormatCardCvc(props: NumberFormatCustomProps) {
    const {inputRef, onChange, ...other} = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => onChange({target: {value: values.value}})}
            format="####"
            isNumericString
        />
    );
}