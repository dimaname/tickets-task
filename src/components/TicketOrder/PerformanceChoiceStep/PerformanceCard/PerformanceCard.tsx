import *  as React from 'react';
import './PerformanceCard.css';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import {SessionsByPerformancesItem} from "../../TicketOrder";
import {Performance} from "../../../../models/PerformancesDTOModel";

type Props = {
    performance: Performance;
    currentSelectedSessionId: string | null;
    sessions: ReadonlyArray<SessionsByPerformancesItem> | void;
    onSelect: (performanceId: string, sessionId: string) => void;
};

type State = {
    cardIsActive: boolean;
    selectedSessionId: string;
};

export class PerformanceCard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            cardIsActive: false,
            selectedSessionId: props.currentSelectedSessionId || '',
        };
    }

    render() {
        const {performance: {attributes}} = this.props;
        const {cardIsActive, selectedSessionId} = this.state;
        const cardClassNames = "performance-card" + (cardIsActive ? ' active-card' : '');
        return <div className={cardClassNames}>
            <div className="performance-card-title">{attributes.title}</div>
            <div className="performance-card-genres">
                <div className="genres-label"> Жанр:</div>
                {attributes.genres.map((genre, i) => <span key={`genre-${i}`} className="genre-item">{genre}</span>)}
            </div>
            {this.getSessionChoiceContent()}
            <Button variant="contained" color="primary" disabled={!selectedSessionId} onClick={this.onSelect}>
                Заказать билет
            </Button>
        </div>;
    }

    private getSessionChoiceContent(): React.ReactNode {
        const {selectedSessionId} = this.state;
        const {sessions} = this.props;
        let content = null;

        if (!sessions || !sessions.length)
            content = 'Нет сеансов для выбора'
        else {
            content = <FormControl classes={{root: 'session'}}>
                <Select
                    autoWidth={true}
                    value={selectedSessionId}
                    onChange={this.onSessionSelect}
                    onOpen={this.onOpenSelect}
                    onClose={this.onCloseSelect}>
                    <MenuItem value={''}>-</MenuItem>
                    {
                        sessions.map(session => <MenuItem key={session.id} value={session.id}>
                            <div className="session-date-wrapper">
                                <div className="session-date">
                                    {session.from.toLocaleDateString()} {session.from.toLocaleTimeString()}
                                </div>
                                Идет: {session.duration}мин.
                            </div>
                        </MenuItem>)
                    }
                </Select>
            </FormControl>
        }

        return <div className="session-choice-content">
            <div className="session-choice-title">Сеансы:</div>
            {content}
        </div>
    }

    private onSessionSelect = (event: React.ChangeEvent<{ name?: string; value: any }>) => {
        this.setState({selectedSessionId: event.target.value})
    };

    private onCloseSelect = () => {
        this.setState({cardIsActive: false});
    };

    private onOpenSelect = () => {
        this.setState({cardIsActive: true});
    };

    private onSelect = () => {
        this.props.onSelect(this.props.performance.id, this.state.selectedSessionId);
    };

}


