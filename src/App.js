import React from "react";
import { Route, Switch, Redirect } from 'react-router-dom'
import { Layout, Menu } from "antd";
import { useHistory, useLocation } from 'react-router-dom'

import Chainchess from './components/chainchess/Chainchess.jsx'
import Chess from './components/chess/Chess.jsx'
import Notfound from './components/notfound/Notfound.jsx'
import Wuzi from './components/wuzi/Wuzi.jsx'

const { Header, Content, Footer } = Layout;

function App() {
    let his = useHistory()
    let loc = useLocation()
    return (
        <>
            <Layout className="layout" style={{ minHeight: '100%' }} >
                <Header style={{ height: '45px', padding: '0px 10px' }} >
                    <Menu
                        style={{ lineHeight: '45px' }}
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={["chess"]}
                        onClick={({ key }) => his.push(key)}
                        selectedKeys={[loc.pathname]}
                    >
                        <Menu.Item key="/chess">chess</Menu.Item>
                        <Menu.Item key="/chainchess">chainchess</Menu.Item>
                        <Menu.Item key="/wuzi">五子棋</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '10px 10px', margin: '0px ', height: '100%' }}>
                    <div style={{ background: '#fff', padding: "10px 10px", minHeight: '100%' }}>
                        <Switch>
                            <Route path="/chess" component={Chess} />
                            <Route path="/chainchess" component={Chainchess} />
                            <Route path="/wuzi" component={Wuzi} />
                            <Route path="/404" component={Notfound} />
                            <Redirect from='/' to='/chess' exact />
                            <Redirect to='/404' />
                        </Switch>
                    </div>
                    <Footer style={{ padding: "5px", textAlign: "center" }}>
                        山东大学 ©2021 19级AI金俊儒
                    </Footer>
                </Content>

            </Layout>
        </>
    );
}
export default App;