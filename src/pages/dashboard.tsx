import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    // Verificar se o token está presente no localStorage
    const token = localStorage.getItem('token');
    
    // Se não houver token, redirecionar para o login
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      <h1>Página do Dashboard</h1>
      <p>Conteúdo do Dashboard</p>
    </div>
  );
};

export default Dashboard;
