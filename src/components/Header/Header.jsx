import {  Menu } from 'antd';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from '@firebase/auth';

import './Header.scss';
import logo from '../../assets/logo.svg';
import { ROUTES } from "../../constants/routes";


export const Header = () => {
    return (
        <Menu mode="horizontal" className={'header'}>
            <Menu.Item>
                <Link to={ROUTES.main}><img src={logo} className={'header__logo'} alt='header-logo'/></Link>
            </Menu.Item>

            <Menu.Item>
                <Link to={ROUTES.main}>Поиск</Link>
            </Menu.Item>

            <Menu.Item>
                <Link to={ROUTES.favorites}>Избранное</Link>
            </Menu.Item>

            <Menu.Item className={'header__logout'}>
                <Link to={ROUTES.auth} onClick={() => signOut(getAuth())}>Выйти</Link>
            </Menu.Item>
        </Menu>
    )
}