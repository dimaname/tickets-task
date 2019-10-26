import *  as React from 'react';
import './App.css';
import {TicketOrder} from "../TicketOrder/TicketOrder";
import {ITicketsApiClient, TicketsApiClient} from "../../apiClients/ticketsApiClient";


type Props = {

};

type State = {

};

export class App extends React.Component<Props, State> {
    ticketsApiClient: ITicketsApiClient;

    constructor(props: Props) {
        super(props);

        this.ticketsApiClient = new TicketsApiClient();
    }

    render() {
        return <div className="App">
                <TicketOrder ticketsApiClient={this.ticketsApiClient}/>
        </div>
    }

}