import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AdminUser } from '@/types/custom/user';
import { getUsers, updateUser } from '@/services/adminApi';

export default function AdminEditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getUsers().then((res) => {
      if (res.success && res.data) {
        const found = res.data.find((u) => String(u.id) === id);
        if (!found) {
          navigate('/admin/users');
          return;
        }
        setUser(found);
        setFirstName(found.firstName);
        setLastName(found.lastName);
        setEmail(found.email);
        setIsAdmin(found.roles.includes('ROLE_ADMIN'));
      }
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const res = await updateUser(user.id, { firstName, lastName, email, isAdmin });
      if (res.success) {
        toast.success('Utilisateur mis à jour.');
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

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 -ml-2 text-muted-foreground">
        <ChevronLeft className="h-4 w-4" />
        Retour
      </Button>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Modifier l'utilisateur</CardTitle>
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
              <Label htmlFor="isAdmin" className="font-normal cursor-pointer">Administrateur</Label>
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
