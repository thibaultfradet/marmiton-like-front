import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, ArrowLeft, Loader2, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { forgotPassword } from '@/services/authApi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-md">
            <ChefHat className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Marmiton</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Vos recettes, votre cuisine</p>
          </div>
        </div>

        <Card className="shadow-lg border-border/60">
          {sent ? (
            <>
              <CardHeader className="space-y-1 pb-4">
                <div className="flex justify-center mb-2">
                  <MailCheck className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-xl text-center">Email envoyé</CardTitle>
                <CardDescription className="text-center">
                  Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation sous peu.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à la connexion
                  </Button>
                </Link>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl">Mot de passe oublié</CardTitle>
                <CardDescription>
                  Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.fr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}

                  <Button type="submit" className="w-full mt-2" disabled={submitting}>
                    {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Envoyer le lien
                  </Button>

                  <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Retour à la connexion
                  </Link>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
