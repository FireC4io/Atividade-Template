import { createContext } from 'react';

// "Caixa" compartilhada entre todas as telas.
// Guarda o usuário logado (ou null quando ninguém está logado).
export const UsuarioContext = createContext({
    usuario: null,
    setUsuario: () => { },
});
