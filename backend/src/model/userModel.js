import { supabase } from '../config/supabase.js';

export const fetchAll = async () => {
    const { data, error } = await supabase.from('pacientes').select('*');
    return { data, error };
}

export const create = async (nome, email, telefone) => {
    const { data, error } = await supabase
        .from('pacientes')
        .insert([{ nome, email, telefone }])
        .select();
    return { data, error };
}