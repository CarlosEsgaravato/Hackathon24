import LayoutDashboard from '../components/LayoutDashboard';
import styles from './home.module.css'; // Importando o CSS Module

const HomePage = () => {
  const environments = ["Auditório", "AlphaLAB", "Biblioteca", "Salas"];

  return (
    <LayoutDashboard>
      <div className={styles.cardGrid}>
        {environments.map((environment, index) => (
          <div key={index} className={styles.card}>
            <h2>{environment}</h2>
          </div>
        ))}
      </div>
    </LayoutDashboard>
  );
};

export default HomePage;
