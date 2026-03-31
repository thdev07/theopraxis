import * as userModel from '../model/userModel.js'

export const fetchAll = async (req, res) => {
    const { data, error } = await userModel.fetchAll();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json(data);
}

export const create = async (req, res) => {
    const { nOme, email, telefone } = req.body;
    const { error, data } = await userModel.create(nome, email, telefone);

    if (error) {
        console.log(`error: ${error.message}`)
        return res.status(400).json({ error: error.message});
    }

    res.json(data);
}