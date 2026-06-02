// frontend/src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'patient' // Valeur par défaut
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // L'URL de votre API Django
            const response = await axios.post('http://127.0.0.1:8000/api/users/register/', formData);
            console.log('Inscription réussie:', response.data);
            // Rediriger vers la page de connexion
        } catch (error) {
            console.error('Erreur d\'inscription:', error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Nom d'utilisateur" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="text" name="first_name" placeholder="Prénom" onChange={handleChange} required />
            <input type="text" name="last_name" placeholder="Nom" onChange={handleChange} required />
            <select name="role" onChange={handleChange} value={formData.role}>
                <option value="patient">Je suis un patient</option>
                <option value="doctor">Je suis un médecin</option>
            </select>
            <button type="submit">S'inscrire</button>
        </form>
    );
}

export default Register;