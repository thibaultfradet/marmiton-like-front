import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const message = isRouteErrorResponse(error)
    ? error.status === 404
      ? "Cette page n'existe pas."
      : `Erreur ${error.status} — ${error.statusText}`
    : "Une erreur inattendue s'est produite.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Oups, quelque chose s'est mal passé</h1>
        <p className="text-muted-foreground">{message}</p>
      </div>
      <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
    </div>
  );
}
