import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createUser } from '@/services/adminApi';

export default function AdminNewUserPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await createUser({ firstName, lastName, email, isAdmin });
      if (res.success) {
        toast.success('Utilisateur créé avec succès.');
        navigate('/admin/users');
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 -ml-2 text-muted-foreground">
        <ChevronLeft className="h-4 w-4" />
        Retour
      </Button>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Nouvel utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">Prénom <span className="text-destructive">*</span></Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Nom <span className="text-destructive">*</span></Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox id="isAdmin" checked={isAdmin} onCheckedChange={(v) => setIsAdmin(!!v)} />
              <Label htmlFor="isAdmin" className="font-normal cursor-pointer">
                Administrateur
              </Label>
            </div>

            <p className="text-xs text-muted-foreground">
              Un mot de passe aléatoire sera généré. L'utilisateur devra utiliser la réinitialisation de mot de passe.
            </p>

            <Button type="submit" disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Créer l'utilisateur
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
