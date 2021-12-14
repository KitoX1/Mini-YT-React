import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Input, Spin } from 'antd';
import { HeartTwoTone, MenuOutlined, AppstoreOutlined } from '@ant-design/icons';

import './MainPage.scss';
import { ROUTES } from '../../constants/routes';
import { Header } from '../../components/Header/Header';
import { FavoritesModal } from '../../components/Modal/FavoritesModal';
import { Preloader } from '../../assets/Preloader/Preloader';
import { getVideos } from '../../redux/slices/appSlice';

const { Search } = Input;


export const MainPage = () => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth.auth);
    const loadingInProgress = useSelector(state => state.app.loadingInProgress);
    const videos = useSelector(state => state.app.videos);
    const withResult = useSelector(state => state.app.withResult);

    const [viewType, setViewType] = useState('blocks');
    const [modalState, setModalState] = useState(false);
    const [currentRequest, setCurrentRequest] = useState('');
    const [initialValues, setInitialValues] = useState({});
    
    const onSearchChange = (event) => {
        setCurrentRequest(event.target.value)
    }
    const closeModal = () => {
        setModalState(false);
    }

    const openAddModal = (values) => {
        setInitialValues(values);
        setModalState(true);
    }    

    if (auth === false) {
        return <Redirect to={ROUTES.auth} />
    }

    return (<>
        {auth 
        ? <><Header />

        <main>
            <div className={withResult ? 'search search__withResult' : 'search search__default'}>
                <p className={withResult ? 'search__titleWithResult' : 'search__titleDefault'}>Поиск видео</p>
                <Search 
                onChange={onSearchChange}
                onSearch={() => dispatch(getVideos({ request: currentRequest }))}
                value={currentRequest}
                placeholder="Введите интересующий запрос" 
                enterButton="Найти" 
                size="large" 
                loading={false} 
                suffix={withResult &&
                    <HeartTwoTone
                    className={'favorites-icon'}
                    onClick={() => openAddModal({
                        request: currentRequest,
                        name: '',
                        sort: 'relevance',
                        slider: 25
                    })}
                    />}
                />
            </div>

            {withResult && 
            <div className={'content'}>
                {videos.items && <>
                <div className={'content__info'}>
                    <div className={'content__breadcrumbs'}>
                        <span>Видео по запросу:</span>
                        <span className={'content__request'}>{`"${videos.request || ''}"`}</span>
                        <span className={'content__amount'}>{videos.pageInfo.resultsPerPage || 0}</span>
                    </div>
                    <div className={'content__viewSwitch'}>
                        <MenuOutlined className={viewType === 'horizontal' && 'selected'} onClick={() => setViewType('horizontal')}/>
                        <AppstoreOutlined className={viewType === 'blocks' && 'selected'} onClick={() => setViewType('blocks')}/>
                    </div>
                </div>

                <div className={viewType === 'blocks' ? 'content__videos' : 'content__videos horizontal'}>
                    {videos && videos.items.length > 0
                    ? videos.items.map(video => 
                        <div className={'content__videoBlock'} key={video.etag}> 
                            <img src={video.snippet.thumbnails.medium.url} alt="YouTube"/>
                            <div>
                                <p className={'content__videoTitle'}>{video.snippet.title}</p>
                                <p className={'content__chanel'}>{video.snippet.channelTitle}</p>
                                <p className={'content__date'}>{video.snippet.publishedAt.split('T')[0]}</p>
                            </div>
                        </div>)   
                    : <h2>Видео не найдены :(</h2>    
                    }
                </div>
                </>}

                <FavoritesModal 
                closeModal={closeModal}
                initialValues={initialValues}
                modalType={'add'}
                modalState={modalState}  
                />

                {loadingInProgress && <div className={'content__loading'}><Spin size="large" /></div>}
            </div>}
        </main></>

        : <Preloader />}
    </>);
};