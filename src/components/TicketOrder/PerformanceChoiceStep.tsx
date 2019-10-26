import *  as React from 'react';
import './TicketOrder.css';
import {PerformancesDTO} from "../../models/PerformancesDTOModel";
import {SessionsDTO} from "../../models/SessionsDTOModel";


type Props = {
    performances: PerformancesDTO | null;
    sessions: SessionsDTO | null;
}

type State = {}

export class PerformanceChoiceStep extends React.Component<Props, State> {


    render() {
        const {performances, sessions} = this.props;
        if (performances === null || sessions === null)
            return null;

        return <div className="performance-choice-step">


            asdasdasdasd
        </div>
    }

}


