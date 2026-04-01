import * as userModel from '../model/userModel.js';

export const fetchAll = async (req, res) => {
    const { data, error } = await userModel.fetchAll();

    if (error) {
        console.error('Erro ao buscar pacientes:', error.message);
        return res.status(400).json({ error: error.message });
    }

    res.json(data);
}

export const create = async (req, res) => {
    const { nome, email, telefone } = req.body;

    if (!nome) {
        return res.status(400).json({ error: 'O campo nome é obrigatório.' });
    }

    const { data, error } = await userModel.create(nome, email, telefone);

    if (error) {
        console.error('Erro ao criar paciente:', error.message);
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
}