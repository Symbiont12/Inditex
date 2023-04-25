import './app.component.scss';
import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from './page-components/homePage/homePage.component';
import DetalleApp from './page-components/detalleApp/detalleApp.component';
import DetalleEpisodio from './page-components/detalleApp/detalleEpisodio/detalleEpisodio.component';
import HeaderComponent from './page-components/header/header.component';


export default class App extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <BrowserRouter>
                <HeaderComponent />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/podcast/:podcastId" element={<DetalleApp />} />
                    <Route path="/podcast/:podcastId/episode/:episodeId" element={<DetalleEpisodio />} />
                </Routes>
            </BrowserRouter>
        )
    }

}
