import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

const Login = () => {
  const router = useRouter();
  const refForm = useRef<HTMLFormElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isToast, setIsToast] = useState(false);

  if (typeof window !== "undefined" && localStorage.getItem('token')) {
    router.push('/');
  }

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
        const { token } = response.data;
        localStorage.setItem('token', token);
        router.push('/');
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          console.error('Credenciais inválidas:', error.response.data.message);
          setIsToast(true); // Mostrar o erro ao usuário
        } else {
          console.error('Erro inesperado:', error.message);
        }
        setIsLoading(false);
        router.replace('/login');
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
};

export default Login;
