import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router';
import { Spin } from 'antd';
import { DeleteTwoTone, PlayCircleTwoTone } from '@ant-design/icons';

import './FavoritesPage.scss';
import { ROUTES } from '../../constants/routes';
import { Header } from "../../components/Header/Header";
import { Preloader } from '../../assets/Preloader/Preloader'
import { FavoritesModal } from '../../components/Modal/FavoritesModal';
import { deleteFavorites, getFavorites } from '../../redux/slices/favoritesSlice';
import { getVideos } from '../../redux/slices/appSlice';


export const FavoritesPage = () => {
    const history = useHistory();

    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth.auth);
    const favorites = useSelector(state => state.favorites.favorites);
    const loadingInProgress = useSelector(state => state.favorites.loadingInProgress);
    const userId = useSelector(state => state.auth.userId);

    const [modalState, setModalState] = useState(false);
    const [initialValues, setInitialValues] = useState({});

    useEffect(() => {
        auth && dispatch(getFavorites());
    }, [userId])
    
    const onSearch = (values, event) => {
        dispatch(getVideos(values));
        history.push(ROUTES.main);
        event.stopPropagation()
    }

    const openEditModal = (values, event) => {
        setInitialValues(values);
        setModalState(true);
    }

    const closeModal = () => {
        setModalState(false);
    }

    if (auth === false) {
        return <Redirect to={ROUTES.auth} />
    } 

    return (<>
        {auth
        ? <><Header />

        <div className={'favorites'}>
            <p className={'favorites__title'}>Избранное</p>
            <div className={'favorites__content'}>
                {favorites && favorites.length > 0
                ? favorites.map(item => 
                <div 
                onClick={() => openEditModal({
                    id: item.id,
                    request: item.request,
                    name: item.name,
                    sort: item.sort,
                    slider: item.slider
                })} 
                className={'favorites__item'}
                key={item.id} 
                >
                    {item.name}

                    <PlayCircleTwoTone 
                    onClick={(event) => onSearch({
                        request: item.request,
                        sort: item.sort,
                        slider: item.slider
                    }, event)}
                    className={'favorites__search'} 
                    />

                    <DeleteTwoTone 
                    onClick={(event) => { dispatch(deleteFavorites(item.id)); event.stopPropagation() }}
                    className={'favorites__delete'} 
                    twoToneColor="#eb2f96" 
                    />
                </div>) 
                : <h2>Сохранённых запросов нет :(</h2>
                }

                {loadingInProgress && <div className={'favorites__loading'}><Spin size="large" /></div>}
            </div>
        </div>

        <FavoritesModal 
        closeModal={closeModal}
        initialValues={initialValues}
        modalType={'edit'}
        modalState={modalState}  />
        </>
        : <Preloader />}
    </>);
}