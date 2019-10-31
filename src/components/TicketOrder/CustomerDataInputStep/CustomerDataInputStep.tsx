import *  as React from 'react';
import './CustomerDataInputStep.css';
import {CustomerData} from "../TicketOrder";
import ruLocale from "date-fns/locale/ru";
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import {emailValidator} from "../../../utils/emailValidator";

type Props = {
    customerData: CustomerData,
    requestWillBeRejected: boolean,
    onPropertyChanged: <K extends keyof CustomerData>(propName: K, propValue: CustomerData[K]) => void,
    toNextStep: () => void,
    toPrevStep: () => void,
    changeRequestWillBeRejected: (value: boolean) => void,
}

type State = {
    emailError: boolean;
    email: string | null,
}

export class CustomerDataInputStep extends React.Component<Props, State> {
    state: State = {
        email: null,
        emailError: false,
    };

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        const email = nextProps.customerData.email;
        if (prevState.email !== email) {
            return {
                email,
                emailError: email && !emailValidator(email)
            };
        }

        return null;
    };

    render() {
        const {email, emailError} = this.state;
        const {acceptRules, paymentType, birthday, firstName, secondName} = this.props.customerData;
        const toPaymentButtonDisabled = !acceptRules || !firstName || !secondName || !email || emailError
            || (!birthday || (birthday && isNaN(birthday.getTime())));
        return <div className="customer-data-step">
            <div className="customer-data-step-title">Ввод данных покупателя</div>
            <div className="customer-data-step-content">
                <TextField
                    autoFocus
                    required
                    label="Имя"
                    value={firstName || ''}
                    margin="none"
                    onChange={this.onFirstNameChange}
                    classes={{root: 'customer-data-field'}}
                />
                <TextField
                    required
                    label="Фамилия"
                    value={secondName || ''}
                    margin="none"
                    onChange={this.onSecondNameChange}
                    classes={{root: 'customer-data-field'}}
                />
                <FormControl classes={{root: 'customer-data-field'}} required>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
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
                        <MenuItem value={'cash'}>Оффлайн</MenuItem>
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
                        onClick={this.props.toNextStep}>
                    {paymentType === 'card' ? 'Перейти к оплате' : 'Заказать билет'}
                </Button>
                {paymentType === 'cash' && <FormControlLabel
                    control={
                        <Switch
                            checked={this.props.requestWillBeRejected}
                            onChange={this.changeRequestWillBeRejected}
                            color="primary"
                        />
                    }
                    label="reject request"
                />}
            </div>
        </div>
    }

    private onBirthdaySelect = (date: Date | null) => {
        this.props.onPropertyChanged('birthday', date);
    };

    private onPaymentTypeSelect = (event: React.ChangeEvent<{ name?: string; value: any }>) => {
        this.props.onPropertyChanged('paymentType', event.target.value);
    };

    private onChangeAcceptRules = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onPropertyChanged('acceptRules', event.target.checked);
    };

    private changeRequestWillBeRejected = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.changeRequestWillBeRejected(event.target.checked);
    };

    private onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onPropertyChanged('email', event.target.value);
    };

    private onFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onPropertyChanged('firstName', event.target.value);
    };

    private onSecondNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onPropertyChanged('secondName', event.target.value);
    };
}




