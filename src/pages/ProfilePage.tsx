import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useAuth } from '@/context/useAuth';
import { updateProfile, updatePassword } from '@/services/authApi';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);

  const [pendingEmail, setPendingEmail] = useState('');
  const [confirmEmailOpen, setConfirmEmailOpen] = useState(false);
  const [confirmingEmail, setConfirmingEmail] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
    }
  }, [user]);

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const submitProfileUpdate = async (fn: string, ln: string, em: string) => {
    setSavingInfo(true);
    try {
      const res = await updateProfile({ firstName: fn, lastName: ln, email: em });
      if (res.success && res.data) {
        refreshUser(res.data);
        toast.success('Profil mis à jour.');
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Une erreur est survenue.');
    } finally {
      setSavingInfo(false);
    }
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== user.email) {
      setPendingEmail(email);
      setConfirmEmailOpen(true);
      return;
    }
    await submitProfileUpdate(firstName, lastName, email);
  };

  const handleEmailConfirm = async () => {
    setConfirmingEmail(true);
    await submitProfileUpdate(firstName, lastName, pendingEmail);
    setConfirmEmailOpen(false);
    setConfirmingEmail(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }
    setSavingPassword(true);
    try {
      const res = await updatePassword({ password: newPassword, confirmPassword });
      if (res.success) {
        toast.success('Mot de passe mis à jour.');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Une erreur est survenue.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
          {initials}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">Mon profil</h1>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Informations personnelles */}
      <Card className="border-border/60">
        <CardHeader className="border-b">
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>
            Modifiez votre prénom, nom et adresse email.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">
                  Prénom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">
                  Nom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">
                Adresse email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              {email !== user.email && (
                <p className="text-xs text-muted-foreground">
                  Une confirmation vous sera demandée avant de changer l'email.
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={savingInfo}>
                {savingInfo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card className="border-border/60">
        <CardHeader className="border-b">
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>
            Choisissez un nouveau mot de passe d'au moins 8 caractères.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={savingPassword}>
                {savingPassword && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Changer le mot de passe
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmEmailOpen}
        onOpenChange={setConfirmEmailOpen}
        title="Confirmer le changement d'email"
        description={`Vous allez remplacer votre email par « ${pendingEmail} ». Ce changement est immédiat.`}
        confirmLabel="Confirmer"
        onConfirm={handleEmailConfirm}
        confirming={confirmingEmail}
      />
    </div>
  );
}
