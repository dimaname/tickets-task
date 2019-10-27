import *  as React from 'react';
import './App.css';
import {TicketOrder} from "../TicketOrder/TicketOrder";
import {ITicketsApiClient, TicketsApiClient} from "../../apiClients/ticketsApiClient";
import {ISessionStorage, SessionStorage} from "../../utils/sessionStorage";


type Props = {};

type State = {};

export class App extends React.Component<Props, State> {
    ticketsApiClient: ITicketsApiClient;
    sessionStorage: ISessionStorage;

    constructor(props: Props) {
        super(props);

        this.ticketsApiClient = new TicketsApiClient();
        this.sessionStorage = new SessionStorage();
    }

    render() {
        return <div className="App">
            <TicketOrder ticketsApiClient={this.ticketsApiClient} sessionStorage={this.sessionStorage}/>
        </div>
    }

}