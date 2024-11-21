'use client'
import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

export default function Login() {
    const router = useRouter();
    const refForm = useRef<HTMLFormElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isToast, setIsToast] = useState(false);

    const submitForm = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (refForm.current && refForm.current.checkValidity()) {
            setIsLoading(true);
            const target = event.target as typeof event.target & {
                email: { value: string };
                password: { value: string };
            };
            const email = target.email.value;
            const password = target.password.value;

            axios.post('http://localhost:8000/api/login', { email, password })
                .then((response) => {
                    localStorage.setItem('token', JSON.stringify(response.data));
                    router.push('/dashboard');
                })
                .catch((error) => {
                    console.error(error);
                    setIsLoading(false);
                    setIsToast(true);
                });
        } else {
            if (refForm.current) {
                refForm.current.classList.add('was-validated');
            }
        }
    }, [router]);

    return (
        <div className={styles.main}>
            {isLoading && <div>Loading...</div>}
            {isToast && <div className={styles.toast}>Credenciais Inválidas</div>}
            <div className={styles.border}>
                <div className="d-flex flex-column align-items-center">
                    <h1 className={styles.title}>Hackathon</h1>
                    <p className={styles.textSecondary}>Painel para Reservas</p>
                    <p className={styles.textSecondary}>Preencha os campos para logar</p>
                </div>
                <hr />
                <form className={`needs-validation align-items-center ${styles.form}`} noValidate onSubmit={submitForm} ref={refForm}>
                    <div className="col-md-12">
                        <label htmlFor="email" className={`form-label ${styles.formLabel}`}>Email: </label>
                        <input type="email" className={`form-control ${styles.formControl}`} placeholder="Digite seu email" id="email" required />
                    </div>
                    <br />
                    <div className="col-md-12 mt-3">
                        <label htmlFor="password" className={`form-label ${styles.formLabel}`}>Senha: </label>
                        <input type="password" className={`form-control ${styles.formControl}`} placeholder="Digite sua senha" id="password" required />
                    </div>
                    <br />
                    <div className="col-md-12 mt-4">
                        <button className={`btn w-100 ${styles.button}`} type="submit">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
