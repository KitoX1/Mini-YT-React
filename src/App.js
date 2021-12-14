import { Route, Switch, Redirect } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";

import { ROUTES } from './constants/routes';
import { AuthPage } from "./views/AuthPage/AuthPage";
import { FavoritesPage } from "./views/FavoritesPage/FavoritesPage";
import { MainPage } from './views/MainPage/MainPage';
import { setAuth, setUserId } from './redux/slices/authSlice';
import { useEffect } from "react";


export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const authUser = getAuth();

    onAuthStateChanged(authUser, (user) => {
      if (user) {
        dispatch(setAuth(true));
        dispatch(setUserId(user.uid));
      } else {
        dispatch(setAuth(false))
      }
    })
  }, [dispatch])

  return (
    <div className="App">
      <Switch>
        <Route path={ROUTES.auth}>
          <AuthPage />
        </Route>

        <Route path={ROUTES.favorites}>
          <FavoritesPage />
        </Route>
        
        <Route path={ROUTES.main}>
          <MainPage />
        </Route>
      </Switch>      
    </div>
  )
}