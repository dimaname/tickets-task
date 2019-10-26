import *  as React from 'react';
import './TicketOrder.css';
import {ITicketsApiClient} from "../../apiClients/ticketsApiClient";
import {PerformancesDTO} from "../../models/PerformancesDTOModel";
import {SessionsDTO} from "../../models/SessionsDTOModel";
import CircularProgress from '@material-ui/core/CircularProgress';
import {ErrorMessage} from "./ErrorMessage";
import {PerformanceChoiceStep} from "./PerformanceChoiceStep";

type LoadingState = 'idle' | 'loading' | 'error' | 'complete';

type Props = {
    ticketsApiClient: ITicketsApiClient;
}

type State = {
    performances: PerformancesDTO | null;
    sessions: SessionsDTO | null;
    isLoading: boolean;
    isError: boolean;
    currentStep: 'performance-choice' | 'user-data' | 'payments';
}

export class TicketOrder extends React.Component<Props, State> {
    state: State = {
        performances: null,
        sessions: null,
        isLoading: false,
        isError: false,
        currentStep: 'performance-choice',
    };

    async componentDidMount() {
        const {ticketsApiClient} = this.props;
        this.setState({isLoading: true});

        try {
            const [performances, sessions] = await Promise.all([ticketsApiClient.getPerformances(), ticketsApiClient.getSessions()]);
            this.setState({performances, sessions});
        } catch (e) {
            this.setState({isError: true});
        } finally {
            this.setState({isLoading: false});
        }
    }

    render() {
        return <div className="ticket-order">
            {this.getContent()}
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
        const currentStep = this.state.currentStep;
        switch (currentStep) {
            case 'performance-choice':
               const {performances, sessions} = this.state;
               return <PerformanceChoiceStep performances={performances} sessions={sessions} />;
            case'user-data' :
                return null;
            case 'payments':
                return null;
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

}


