import *  as React from 'react';
import './TicketOrder.css';
import {ITicketsApiClient} from "../../apiClients/ticketsApiClient";
import {PerformancesDTO} from "../../models/PerformancesDTOModel";
import {SessionsDTO} from "../../models/SessionsDTOModel";
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error'
import {ErrorMessage} from "./ErrorMessage";
import {PerformanceChoiceStep} from "./PerformanceChoiceStep/PerformanceChoiceStep";
import {CustomerDataInputStep} from "./CustomerDataInputStep/CustomerDataInputStep";
import {ISessionStorage} from "../../utils/sessionStorage";
import {PaymentCardStep} from "./PaymentCardStep/PaymentCardStep";
import {OrderDTO} from "../../models/OrderDTOModel";

type LoadingState = 'idle' | 'loading' | 'error' | 'complete';
type OrderSteps = 'performance-choice' | 'customer-data' | 'payment-card';

type Props = {
    ticketsApiClient: ITicketsApiClient;
    sessionStorage: ISessionStorage;
}

type State = {
    performances: PerformancesDTO | null;
    sessions: SessionsByPerformances | null;
    isLoading: boolean;
    isError: boolean;
    currentStep: OrderSteps;
    selectedPerformanceId: string | null;
    selectedSessionId: string | null;
    customerData: CustomerData;
    paymentCard: PaymentCard | null;
    isSuccessSnackbarOpened: boolean;
    isErrorSnackbarOpened: boolean;
    requestWillBeRejected: boolean;
}

export type SessionsByPerformances = {
    [key: string]: ReadonlyArray<SessionsByPerformancesItem>
}

export type SessionsByPerformancesItem = {
    id: string;
    from: Date;
    duration: number;
}

export type CustomerData = {
    firstName: string | null;
    secondName: string | null;
    email: string | null;
    birthday: Date | null;
    paymentType: PaymentType | null;
    acceptRules: boolean;
}

export type PaymentCard = {
    cardNumber: string,
    cardDate: string,
    cardCvc: string
}

export type PaymentType = 'card' | 'cash';


export class TicketOrder extends React.Component<Props, State> {
    state: State = {
        performances: null,
        sessions: null,
        isLoading: false,
        isError: false,
        selectedPerformanceId: null,
        selectedSessionId: null,
        currentStep: 'performance-choice',
        customerData: getDefaultCustomerData(),
        paymentCard: null,
        isSuccessSnackbarOpened: false,
        isErrorSnackbarOpened: false,
        requestWillBeRejected: false,
    };

    async componentDidMount() {
        const {ticketsApiClient, sessionStorage} = this.props;
        this.setState({isLoading: true});

        try {
            const [performances, sessions] = await Promise.all([ticketsApiClient.getPerformances(), ticketsApiClient.getSessions()]);
            const sessionsByPerformances = getSessionsByPerformance(sessions);
            this.setState({
                performances,
                sessions: sessionsByPerformances,
            });
        } catch (e) {
            this.setState({isError: true});
        } finally {
            const restoredCurrentStep = sessionStorage.getItem('currentStep');
            const selectedPerformanceId = sessionStorage.getItem('selectedPerformanceId');
            const selectedSessionId = sessionStorage.getItem('selectedSessionId');
            const restoredCustomerData = sessionStorage.getItem('customerData');
            const restoredProps = {
                currentStep: orderStepParse(restoredCurrentStep),
                customerData: customerDataParse(restoredCustomerData),
                selectedPerformanceId,
                selectedSessionId,
            };
            this.setState({
                isLoading: false,
                ...restoredProps,
            });
        }
    }

    render() {
        const {isSuccessSnackbarOpened, isErrorSnackbarOpened} = this.state;
        return <div className="ticket-order">
            <div className="ticket-order-title">Заказ билета</div>
            {this.getContent()}
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onClose={this.closeSnackbar}
                open={isSuccessSnackbarOpened || isErrorSnackbarOpened}
                autoHideDuration={6000}
            >
                {isSuccessSnackbarOpened
                    ? <SnackbarContentWrapper success/>
                    : isErrorSnackbarOpened
                        ? <SnackbarContentWrapper success={false}/>
                        : null}
            </Snackbar>
        </div>
    }

    private getContent(): React.ReactNode {
        const loadingState = this.getLoadingState();
        switch (loadingState) {
            case 'idle':
                return null;
            case 'loading':
                return <CircularProgress/>;
            case 'error':
                return <ErrorMessage/>;
            case 'complete':
                return this.getCurrentStep();
        }
        const allCaseHandled: never = loadingState;
        return;
    }

    private getCurrentStep(): React.ReactNode {
        const {customerData, requestWillBeRejected, currentStep} = this.state;

        switch (currentStep) {
            case 'performance-choice':
                const {performances, sessions, selectedPerformanceId, selectedSessionId} = this.state;
                return <PerformanceChoiceStep performances={performances} sessions={sessions}
                                              selectedPerformanceId={selectedPerformanceId}
                                              selectedSessionId={selectedSessionId}
                                              toNextStep={this.firstStepCompleted}/>;
            case 'customer-data':
                return <CustomerDataInputStep toNextStep={this.secondStepCompleted} toPrevStep={this.toFirstStep}
                                              customerData={customerData}
                                              requestWillBeRejected={requestWillBeRejected}
                                              changeRequestWillBeRejected={this.changeRequestWillBeRejected}
                                              onPropertyChanged={this.onCustomerPropertyChanged}/>;
            case 'payment-card':
                return <PaymentCardStep requestWillBeRejected={requestWillBeRejected}
                                        changeRequestWillBeRejected={this.changeRequestWillBeRejected}
                                        onSubmit={this.onPaymentCardSubmit} toPrevStep={this.toSecondStep}/>;
        }
        const allCaseHandled: never = currentStep;
        return;
    }

    private getLoadingState(): LoadingState {
        const {performances, isLoading, isError} = this.state;
        if (isLoading)
            return 'loading';
        if (isError)
            return 'error';
        if (!isLoading && !performances)
            return 'idle';

        return 'complete'
    }

    private firstStepCompleted = (performanceId: string, sessionId: string) => {
        this.setState({
            selectedPerformanceId: performanceId,
            selectedSessionId: sessionId,
        });
        this.props.sessionStorage.setItem('selectedPerformanceId', performanceId);
        this.props.sessionStorage.setItem('selectedSessionId', sessionId);
        this.toSecondStep();
    };

    private toFirstStep = () => this.changeStep('performance-choice');

    private toSecondStep = () => this.changeStep('customer-data');

    private changeStep = (nextStep: OrderSteps) => {
        this.props.sessionStorage.setItem('currentStep', nextStep);
        this.setState({
            currentStep: nextStep,
        });
    };

    private onCustomerPropertyChanged = <K extends keyof CustomerData>(propName: K, propValue: CustomerData[K]) => {
        const customerData = {
            ...this.state.customerData,
            [propName]: propValue,
        };

        this.props.sessionStorage.setItem('customerData', JSON.stringify(customerData));
        this.setState({customerData});
    };

    private secondStepCompleted = () => {
        if (this.state.customerData.paymentType === 'card')
            this.changeStep('payment-card');
        else {
            this.makeTicketsOrder();
        }
    };

    private changeRequestWillBeRejected = (value: boolean) => {
        this.setState({requestWillBeRejected: value});
    };

    private onPaymentCardSubmit = (paymentCard: PaymentCard) => {
        this.setState({paymentCard});
        this.makeTicketsOrder();
    };

    private async makeTicketsOrder() {
        const {selectedSessionId, customerData, paymentCard, requestWillBeRejected} = this.state;
        try {
            const order = makeOrderDTO(selectedSessionId, customerData, paymentCard);
            await this.props.ticketsApiClient.makeTicketsOrder(order, requestWillBeRejected);
            this.setState({isSuccessSnackbarOpened: true, isErrorSnackbarOpened: false})
            this.toFirstStep();

        } catch (e) {
            this.setState({isErrorSnackbarOpened: true, isSuccessSnackbarOpened: false})
        }

    };

    private closeSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({isSuccessSnackbarOpened: false, isErrorSnackbarOpened: false});
    }
}

function makeOrderDTO(sessionId: string | null, customerData: CustomerData, paymentCard: PaymentCard | null): OrderDTO {
    const {firstName, secondName, birthday, email} = customerData;
    if (!sessionId || !firstName || !secondName || !birthday || !email)
        throw new Error('Failed to make OrderDTO model.');
    const order: OrderDTO = {
        data: {
            type: 'orders',
            attributes: {
                session: sessionId,
                first_name: firstName,
                last_name: secondName,
                birthday: birthday.toLocaleDateString(),
                email,
                payment: {
                    type: 'cash',
                }
            }
        }
    };


    if (customerData.paymentType === 'card' && paymentCard)
        order.data.attributes.payment = {
            type: "card",
            card: {
                number: paymentCard.cardNumber,
                valid_to: paymentCard.cardDate,
                name: paymentCard.cardCvc
            }
        };


    return order;
}


function getSessionsByPerformance(sessions: SessionsDTO): SessionsByPerformances {
    return sessions.data.reduce((result: SessionsByPerformances, session) => {
        const performanceId = session.relationships.performance.data.id;
        if (!result[performanceId]) {
            result[performanceId] = [];
        }
        const from = new Date(session.attributes.from);
        const to = new Date(session.attributes.to);
        const duration = Math.floor((to.getTime() - from.getTime()) / 1000 / 60);
        result[performanceId] = [
            ...result[performanceId],
            {
                id: session.id,
                from,
                duration,
            }
        ];
        return result;
    }, {});
}


function orderStepParse(step: string | null): OrderSteps {
    switch (step) {
        case 'customer-data':
            return 'customer-data';
        case 'payment-card':
            return 'payment-card';
        case 'performance-choice':
        default:
            return 'performance-choice';
    }
}

function customerDataParse(jsonString: string | null): CustomerData {
    const defaultCustomerData = getDefaultCustomerData();
    if (!jsonString)
        return defaultCustomerData;
    const obj = JSON.parse(jsonString);

    return {
        firstName: obj.firstName ? obj.firstName : defaultCustomerData.firstName,
        secondName: obj.secondName ? obj.secondName : defaultCustomerData.secondName,
        email: obj.email ? obj.email : defaultCustomerData.email,
        birthday: obj.birthday ? new Date(obj.birthday) : defaultCustomerData.birthday,
        paymentType: obj.paymentType ? obj.paymentType : defaultCustomerData.paymentType,
        acceptRules: obj.acceptRules ? obj.acceptRules : defaultCustomerData.acceptRules,
    }
}


function getDefaultCustomerData(): CustomerData {
    return {
        firstName: null,
        secondName: null,
        email: null,
        birthday: null,
        paymentType: null,
        acceptRules: false,
    }
}

export interface SnackbarContentWrapperProps {
    success: boolean;
}

function SnackbarContentWrapper(props: SnackbarContentWrapperProps) {
    const {success} = props;
    const Icon = success ? CheckCircleIcon : ErrorIcon;
    const message = success ? 'Билеты заказаны успешно!' : 'Произошла ошибка при заказе билетов!';
    const classes = success ? 'successful-snackbar' : 'error-snackbar';

    return (
        <SnackbarContent
            className={classes}
            message={
                <div className='snackbar-message-wrapper'>
                    <div className='snackbar-icon-wrapper'><Icon/></div>
                    {message}
                </div>
            }
        />
    );
}
