/* /lib/auth.js */

import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

//Registrar un nuevo usuario
export const registerUser = (username, name, phone, email, password) => {
  //evitar que la función se ejecute en el servidor
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
    .post(`${API_URL}/auth/local/register`, { username, name, phone, email, password }).then((res) => {
        //utiliza ra ruta de strapi /auth/local/register para crear un nuevo usuario 

        //establecer la respuesta del token de Strapi para la validación del servidor
        Cookie.set("token", res.data.jwt);

        //resuelva la promesa de establecer la carga como falsa en el formulario de registro
        resolve(res);
        //redirigir a la página de inicio para la selección de restauración
        Router.push("/");
      })
      .catch((error) => {
        //rechazar la promesa y devolver el objeto de error al formulario
        reject(error);
      });
  });
};

export const login = (identifier, password) => {
  //evitar que la función se ejecute en el servidor
  if (typeof window === "undefined") {
    return;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local/`, { identifier, password })
      .then((res) => {
        //establecer la respuesta del token de Strapi para la validación del servidor
        Cookie.set("token", res.data.jwt);
        Cookie.set("user", res.data.user);
        console.log(res.data);
        //resuelva la promesa de establecer la carga como falsa en el formulario de registro
        resolve(res);
        //redirigir a la página de inicio para la selección de restauración
        Router.push("/");
      })
      .catch((error) => {
        //rechazar la promesa y devolver el objeto de error al formulario
        reject(error);
      });
  });
};

export const logout = () => {
  //eliminar token y cookie de usuario
  Cookie.remove("token");
  delete window.__user;
  // sincronizar el cierre de sesión entre varias ventanas
  window.localStorage.setItem("logout", Date.now());
  //redirigir a la página de inicio
  Router.push("/");
};

//Componente de orden superior para envolver nuestras páginas y cerrar sesión simultáneamente en las pestañas registradas
// ESTO NO SE UTILIZA en el tutorial, solo se proporciona si desea implementar
export const withAuthSync = (Component) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        Router.push("/login");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Wrapper.getInitialProps = Component.getInitialProps;
  }

  return Wrapper;
};