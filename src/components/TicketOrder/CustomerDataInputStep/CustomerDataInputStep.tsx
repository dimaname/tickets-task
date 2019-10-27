import *  as React from 'react';
import './CustomerDataInputStep.css';
import {PaymentType} from "../TicketOrder";
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import {emailValidator} from "../../../utils/emailValidator";

type Props = {
    toNextStep: (firstName: string, lastName: string, birthday: string, email: string, paymentType: PaymentType) => void,
    toPrevStep: () => void,
}

type State = {
    acceptRules: boolean;
    emailError: boolean;
    paymentType: PaymentType | null;
    birthday: Date | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
}

export class CustomerDataInputStep extends React.Component<Props, State> {
    state: State = {
        acceptRules: false,
        emailError: false,
        paymentType: null,
        birthday: null,
        firstName: null,
        lastName: null,
        email: null,
    };

    render() {
        const {acceptRules, paymentType, birthday, firstName, lastName, email, emailError} = this.state;
        const toPaymentButtonDisabled = !acceptRules
            || !firstName || !lastName || !email || emailError
            || (!birthday || birthday && isNaN(birthday.getTime()));
        return <div className="customer-data-step">
            <div className="customer-data-step-title">Вввод данных покупателя</div>
            <div className="customer-data-step-content">
                <TextField
                    required
                    label="Имя"
                    value={firstName || ''}
                    margin="none"
                    classes={{root: 'customer-data-field'}}
                />
                <TextField
                    required
                    label="Фамилия"
                    value={lastName || ''}
                    margin="none"
                    classes={{root: 'customer-data-field'}}
                />
                <FormControl classes={{root: 'customer-data-field'}} required>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            required
                            variant="inline"
                            format="dd.MM.yyyy"
                            margin="none"
                            id="date-picker-inline"
                            label="Дата рождения"
                            invalidDateMessage="Неверный формат даты"
                            value={birthday}
                            onChange={this.onBirthdaySelect}
                        />
                    </MuiPickersUtilsProvider>
                </FormControl>
                <TextField
                    required
                    label="Email"
                    error={emailError}
                    value={email || ''}
                    margin="none"
                    onChange={this.onEmailChange}
                    classes={{root: 'customer-data-field'}}
                />
                <FormControl classes={{root: 'payment-select customer-data-field'}} required>
                    <InputLabel htmlFor="payment-select">Способ оплаты</InputLabel>
                    <Select
                        margin='none'
                        autoWidth={true}
                        value={paymentType || ''}
                        onChange={this.onPaymentTypeSelect}
                        inputProps={{
                            id: 'payment-select',
                        }}
                    >
                        <MenuItem value={'card'}>Картой</MenuItem>
                        <MenuItem value={'offline'}>Оффлайн</MenuItem>
                    </Select>
                </FormControl>
                <FormControl required error={false}>
                    <FormControlLabel
                        control={<Checkbox checked={acceptRules} onChange={this.onChangeAcceptRules}/>}
                        label="Принимаю условия"
                    />
                </FormControl>
            </div>
            <div className="buttons-container">
                <Button variant="outlined" onClick={this.props.toPrevStep}>
                    Назад
                </Button>
                <Button variant="contained" color="primary" disabled={toPaymentButtonDisabled}
                        onClick={this.toPaymentsStep}>
                    Перейти к оплате
                </Button>
            </div>
        </div>
    }

    private onBirthdaySelect = (date: Date | null) => {
        this.setState({
            birthday: date,
        });
    };

    private onPaymentTypeSelect = (event: React.ChangeEvent<{ name?: string; value: any }>) => {
        this.setState({
            paymentType: event.target.value,
        });
    };

    private onChangeAcceptRules = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            acceptRules: event.target.checked,
        });
    };
    private onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const email = event.target.value;
        console.error(emailValidator(email))
        this.setState({
            emailError: !emailValidator(email),
            email,
        });
    };

    private toPaymentsStep = () => {

    };


}




