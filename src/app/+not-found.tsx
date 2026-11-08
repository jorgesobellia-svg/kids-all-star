import { Redirect } from 'expo-router';

// Cualquier dirección desconocida vuelve al inicio de la app.
export default function NotFound() {
  return <Redirect href="/" />;
}
