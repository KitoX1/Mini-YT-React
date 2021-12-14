import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Redirect } from 'react-router-dom';

import './AuthPage.scss';
import logo from '../../assets/logo.svg'
import { ROUTES } from '../../constants/routes';
import { Preloader } from '../../assets/Preloader/Preloader';

export const AuthPage = () => {
    const auth = useSelector(state => state.auth.auth);

    const [formType, setFormType] = useState('login');

    const onFinish = (values) => {
        const authUser = getAuth();

        {formType === 'login' 
        ? signInWithEmailAndPassword(authUser, values.email_login, values.password_login)
        .catch(error => alert(error.message))
        : createUserWithEmailAndPassword(authUser, values.email_registration, values.password_registration)
        .catch(error => alert(error.message))
        }
    }

    if (auth === true) {
        return <Redirect to={ROUTES.main} />
    }

    return (<>
        {auth === false 
        ? <Form
        name="auth"
        className="auth"
        layout={'vertical'}
        initialValues={{
            remember: true,
        }}
        onFinish={onFinish}
        >
            <img src={logo} className={'auth__logo'}/>

            <p className={'auth__title'}>{formType === 'login' ? 'Вход' : 'Регистрация'}</p>

            {formType === 'registration' 
            && <Form.Item
            name="username"
            label={'Имя пользователя'}
            rules={[{
                required: true,
                message: 'Введите Имя пользователя, пожалуйста',
            }]}
            >
                <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="Антон" 
                />
            </Form.Item>}


            <Form.Item
            name={formType === 'login' ? 'email_login' : 'email_registration'}
            label={'Email'}
            rules={[{
                type: 'email',
                message: 'Неверный формат Email'
            },
            {
                required: true,
                message: 'Введите Email, пожалуйста',
            }]}
            >
                <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                type={'email'}
                placeholder="example@gmai.com" />
            </Form.Item>

            <Form.Item
            name={formType === 'login' ? 'password_login' : 'password_registration'}
            label={'Пароль'}
            rules={[{
                required: true,
                message: 'Введите пароль, пожалуйста'
            },
            {
                message: 'Пароль должен состоять из 6 и более символов',
                min: 6
            }]}
            >
                <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="example123"
                />
            </Form.Item>

            <Form.Item className={'auth__submitGroup'}>
                <Button className={'auth__submit'} type="primary" htmlType="submit">
                    {formType === 'login' ? 'Войти' : 'Зарегистрироваться'}
                </Button>

                Или <a onClick={() => setFormType(`${formType === 'login' ? 'registration' : 'login'}`)}>{formType === 'login' ? 'Зарегистрироваться' : 'Войти'}</a>
            </Form.Item>
        </Form>

        : <Preloader />}
    </>);
};