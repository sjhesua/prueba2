/* /context/AppContext.js */

import React from "react";
// crear contexto de autenticación con valor predeterminado

// establecer la copia de seguridad predeterminada para isAuthenticated si no se proporciona ninguna en el proveedor
const AppContext = React.createContext({ isAuthenticated: false });
export default AppContext;