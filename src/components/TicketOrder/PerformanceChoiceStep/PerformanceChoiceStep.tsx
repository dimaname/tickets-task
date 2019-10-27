import *  as React from 'react';
import './PerformanceChoiceStep.css';
import {PerformancesDTO} from "../../../models/PerformancesDTOModel";
import {PerformanceCard} from "../PerformanceCard/PerformanceCard";
import {SessionsByPerformances} from "../TicketOrder";


type Props = {
    performances: PerformancesDTO | null;
    sessions: SessionsByPerformances | null;
    selectedPerformanceId: string | null;
    selectedSessionId: string | null;
    toNextStep: (performanceId: string, sessionId: string) => void,
}

type State = {}

export class PerformanceChoiceStep extends React.Component<Props, State> {

    render() {
        const {performances, sessions, selectedSessionId, selectedPerformanceId} = this.props;
        if (performances === null || sessions === null)
            return null;

        return <div className="performance-choice-step">
            <div className="performance-choice-step-title">Выбор спектакля</div>
            <div className="performance-choice-step-cards">
                {performances.data.map(performance =>
                    <PerformanceCard key={performance.id} performance={performance} sessions={sessions[performance.id]}
                                     onSelect={this.props.toNextStep}
                                     currentSelectedSessionId={selectedPerformanceId === performance.id ? selectedSessionId : null}/>)}
            </div>
        </div>
    }
}




