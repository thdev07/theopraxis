import supabase from '../config/supabase.js';

export const fetchAll = async () => {
    return await supabase.from('users').select('*');
}

export const create = async (nome, email, telefone) => {
    return await supabase.from('users').insert({ nome, email, telefone }).select();
}